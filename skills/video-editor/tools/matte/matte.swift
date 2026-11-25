// Person matte for a video with Apple's Vision framework (built into macOS, nothing to download).
// swiftc -O matte.swift -o /tmp/matte && matte IN.mov OUT.mov   -> grey matte video, white = person, same size and frame count
import AVFoundation
import Vision
import CoreImage

let a = CommandLine.arguments
guard a.count >= 3 else { print("matte IN OUT"); exit(1) }
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let track = try await asset.loadTracks(withMediaType: .video)[0]
    let size = try await track.load(.naturalSize)
    let reader = try AVAssetReader(asset: asset)
    let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    reader.add(out)
    let url = URL(fileURLWithPath: a[2]); try? FileManager.default.removeItem(at: url)
    let writer = try AVAssetWriter(outputURL: url, fileType: .mov)
    let w = Int(size.width), h = Int(size.height)
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.proRes422HQ, AVVideoWidthKey: w, AVVideoHeightKey: h])
    let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: w, kCVPixelBufferHeightKey as String: h])
    writer.add(input); reader.startReading(); writer.startWriting(); writer.startSession(atSourceTime: .zero)
    let req = VNGeneratePersonSegmentationRequest(); req.qualityLevel = .accurate; req.outputPixelFormat = kCVPixelFormatType_OneComponent8
    let handler = VNSequenceRequestHandler(); let ctx = CIContext(); var n = 0; var first: CMTime? = nil
    while let sb = out.copyNextSampleBuffer() {
      guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
      try autoreleasepool {
        try handler.perform([req], on: pb)
        let m = req.results!.first!.pixelBuffer
        var im = CIImage(cvPixelBuffer: m)
        im = im.transformed(by: CGAffineTransform(scaleX: CGFloat(w) / im.extent.width, y: CGFloat(h) / im.extent.height))
        // guided upsample: follow the edges of the picture (hair, collar)
        let g = CIFilter(name: "CIEdgePreserveUpsampleFilter", parameters: [kCIInputImageKey: CIImage(cvPixelBuffer: pb), "inputSmallImage": CIImage(cvPixelBuffer: m), "inputSpatialSigma": 3.0, "inputLumaSigma": 0.12])
        if let o = g?.outputImage { im = o }
        var dst: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &dst)
        ctx.render(im, to: dst!, bounds: CGRect(x: 0, y: 0, width: w, height: h), colorSpace: nil)
        let t = CMSampleBufferGetPresentationTimeStamp(sb); if first == nil { first = t }
        while !input.isReadyForMoreMediaData { usleep(2000) }
        ad.append(dst!, withPresentationTime: CMTimeSubtract(t, first!)); n += 1
      }
    }
    input.markAsFinished(); await writer.finishWriting(); print("frames", n)
  } catch { print("error", error) }
  sem.signal()
}
sem.wait()

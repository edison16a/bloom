"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { copyText } from "@/lib/clipboard";
import { ClaudeMark, CodexMark } from "./AgentMarks";
import styles from "./SetupPrompt.module.css";

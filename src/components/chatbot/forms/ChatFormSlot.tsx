"use client";

/**
 * Lazy form dispatcher for in-chat forms (Ask Growy).
 *
 * Each form is loaded on demand via `next/dynamic({ ssr: false })`, so the base
 * chatbot chunk does not include any of the form code. The form chunk is
 * fetched only when the user's intent triggers it.
 *
 * Memoized so unrelated message re-renders never retrigger lazy imports.
 */

import React, { memo } from "react";
import dynamic from "next/dynamic";
import { ChatMessageSkeleton } from "../../ui/loading-skeletons";
import type { ChatbotFormType } from "@/lib/chatbotScope";

const Loading = () => <ChatMessageSkeleton />;

const ChatAssessmentForm = dynamic(() => import("./ChatAssessmentForm"), {
  ssr: false,
  loading: Loading,
});
const ChatTrialForm = dynamic(() => import("./ChatTrialForm"), {
  ssr: false,
  loading: Loading,
});
const ChatEnrollForm = dynamic(() => import("./ChatEnrollForm"), {
  ssr: false,
  loading: Loading,
});
const ChatContactForm = dynamic(() => import("./ChatContactForm"), {
  ssr: false,
  loading: Loading,
});
const ChatCampForm = dynamic(() => import("./ChatCampForm"), {
  ssr: false,
  loading: Loading,
});

export interface ChatFormSlotProps {
  type: ChatbotFormType;
  prefill?: Record<string, string>;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

function ChatFormSlotInner({ type, prefill, onSuccess, onCancel }: ChatFormSlotProps) {
  switch (type) {
    case "assessment":
      return <ChatAssessmentForm onSuccess={onSuccess} onCancel={onCancel} />;
    case "trial":
      return <ChatTrialForm onSuccess={onSuccess} onCancel={onCancel} />;
    case "enroll":
      return <ChatEnrollForm onSuccess={onSuccess} onCancel={onCancel} />;
    case "contact":
      return <ChatContactForm onSuccess={onSuccess} onCancel={onCancel} />;
    case "camp":
      return (
        <ChatCampForm
          prefill={{ campInterest: prefill?.campInterest }}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      );
    default:
      return null;
  }
}

const ChatFormSlot = memo(ChatFormSlotInner);
ChatFormSlot.displayName = "ChatFormSlot";

export default ChatFormSlot;

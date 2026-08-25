import { createContext, useContext, type PropsWithChildren } from "react";
import { useRecordingSession } from "./useRecordingSession";

type RecordSessionValue = ReturnType<typeof useRecordingSession>;

const RecordSessionContext = createContext<RecordSessionValue | null>(null);

export function RecordSessionProvider({ children }: PropsWithChildren) {
  const session = useRecordingSession();
  return (
    <RecordSessionContext.Provider value={session}>{children}</RecordSessionContext.Provider>
  );
}

export function useRecordSession() {
  const ctx = useContext(RecordSessionContext);
  if (!ctx) {
    throw new Error("useRecordSession must be used within RecordSessionProvider");
  }
  return ctx;
}

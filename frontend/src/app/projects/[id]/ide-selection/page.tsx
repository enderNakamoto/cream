import IDESelectionClient from "./ide-selection-client";

export default async function IDESelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IDESelectionClient projectId={id} />;
} 
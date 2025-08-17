import PRDPreviewClient from "./prd-preview-client";

export default async function PRDPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <PRDPreviewClient projectId={id} />;
} 
import RefinedPRDPreviewClient from "./refined-prd-preview-client";

export default async function RefinedPRDPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RefinedPRDPreviewClient projectId={id} />;
} 
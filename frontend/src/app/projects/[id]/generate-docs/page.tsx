import GenerateDocsClient from "./generate-docs-client";

export default async function GenerateDocsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GenerateDocsClient projectId={id} />;
} 
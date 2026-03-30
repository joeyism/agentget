import type { MetadataRoute } from 'next';
import { getExternalAgents } from '@/lib/external-agents';
import { getBuiltinAgentDocs } from '@/lib/builtin-agent-docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://agentget.sh';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/docs/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/audits`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const builtinAgents = getBuiltinAgentDocs().map((agent) => ({
    url: `${base}/docs/agents/${agent.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const externalAgents = getExternalAgents().map((agent) => ({
    url: `${base}/agents/${agent.key}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...builtinAgents, ...externalAgents];
}

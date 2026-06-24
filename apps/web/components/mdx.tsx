import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  ChatComposerPreview,
  EmoteAutocompletePreview,
  EmoteInputPreview,
  EmoteListPreview,
  FeedbackWidgetPreview,
  PostReactionsPreview,
  ReactionButtonPreview,
  ReactionCounterPreview,
  ReactionSliderPreview,
} from './doc-previews';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Used by the recipes' React/Svelte code switcher
    Tab,
    Tabs,
    EmoteListPreview,
    EmoteAutocompletePreview,
    EmoteInputPreview,
    ReactionButtonPreview,
    ReactionCounterPreview,
    ReactionSliderPreview,
    // Recipe live previews (React)
    PostReactionsPreview,
    ChatComposerPreview,
    FeedbackWidgetPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

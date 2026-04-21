import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  EmoteAutocompletePreview,
  EmoteInputPreview,
  EmoteListPreview,
  ReactionButtonPreview,
  ReactionCounterPreview,
  ReactionSliderPreview,
} from './doc-previews';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    EmoteListPreview,
    EmoteAutocompletePreview,
    EmoteInputPreview,
    ReactionButtonPreview,
    ReactionCounterPreview,
    ReactionSliderPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

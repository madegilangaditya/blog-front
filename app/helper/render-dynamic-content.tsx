import dynamic from "next/dynamic";
import React, { ComponentType } from "react";

// Dynamic imports for better code splitting
const Hero = dynamic(() => import("../components/Hero"));


// Base type for all dynamic zone blocks
export interface DynamicBlock {
  id: number;
  __component: string;
  [key: string]: unknown;
}

// Component registry mapping Strapi component names to React components
// The key format follows Strapi's naming convention: "category.component-name"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentRegistry: Record<string, ComponentType<any>> = {
  // Hero components
  "sections.hero": Hero,
  
};

/**
 * Register a custom component to the registry
 * @param componentName - Strapi component name (e.g., "blocks.my-component")
 * @param Component - React component to render
 */
export function registerComponent(
  componentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>
): void {
  componentRegistry[componentName] = Component;
}

/**
 * Get a component from the registry
 * @param componentName - Strapi component name
 * @returns The React component or undefined if not found
 */
export function getComponent(
  componentName: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): ComponentType<any> | undefined {
  return componentRegistry[componentName];
}

interface RenderOptions {
  /** Custom wrapper element for each block */
  wrapper?: ComponentType<{ children: React.ReactNode; block: DynamicBlock }>;
  /** Callback when a component is not found */
  onMissingComponent?: (componentName: string) => void;
  /** Show placeholder for missing components in development */
  showMissingPlaceholder?: boolean;
}

/**
 * Render a single dynamic block
 * @param block - The dynamic zone block from Strapi
 * @param options - Render options
 * @returns JSX element or null
 */
export function renderBlock(
  block: DynamicBlock,
  options: RenderOptions = {}
): React.ReactNode {
  const { __component, id, ...props } = block;
  const Component = componentRegistry[__component];

  if (!Component) {
    options.onMissingComponent?.(__component);

    if (options.showMissingPlaceholder && process.env.NODE_ENV === "development") {
      return (
        <div
          key={id}
          className="p-4 border-2 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg my-4"
        >
          <p className="text-yellow-700 dark:text-yellow-400 font-medium">
            Missing component: <code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">{__component}</code>
          </p>
          <details className="mt-2">
            <summary className="text-sm text-yellow-600 dark:text-yellow-500 cursor-pointer">
              View props
            </summary>
            <pre className="mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded overflow-auto">
              {JSON.stringify(props, null, 2)}
            </pre>
          </details>
        </div>
      );
    }

    return null;
  }

  const element = <Component key={id} {...props} />;

  if (options.wrapper) {
    const Wrapper = options.wrapper;
    return (
      <Wrapper key={id} block={block}>
        {element}
      </Wrapper>
    );
  }

  return element;
}

/**
 * Render an array of dynamic zone blocks
 * @param blocks - Array of dynamic zone blocks from Strapi
 * @param options - Render options
 * @returns Array of JSX elements
 */
export function renderDynamicContent(
  blocks: DynamicBlock[] | null | undefined,
  options: RenderOptions = {}
): React.ReactNode[] {
  if (!blocks || !Array.isArray(blocks)) {
    return [];
  }

  return blocks.map((block) => renderBlock(block, options));
}

/**
 * Component wrapper for rendering dynamic content
 * Use this when you want to render dynamic content as a React component
 */
interface DynamicContentProps {
  blocks: DynamicBlock[] | null | undefined;
  className?: string;
  options?: RenderOptions;
}

export function DynamicContent({
  blocks,
  className,
  options = { showMissingPlaceholder: true },
}: DynamicContentProps): React.ReactElement {
  return (
    <div className={className}>
      {renderDynamicContent(blocks, options)}
    </div>
  );
}

export default DynamicContent;

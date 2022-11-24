import { XMLComponent, XMLNode } from './xmlNode';

export class XMLDocument {
  constructor(public nodes: XMLNode[]) {}

  findTopLevelComponent(kind: string): XMLComponent | undefined {
    return this.nodes.find((node) => node.kind === kind && node instanceof XMLComponent) as XMLComponent;
  }
}

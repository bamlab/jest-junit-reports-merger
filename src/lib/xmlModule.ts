import { XMLParser, XMLBuilder, XmlBuilderOptions, X2jOptions } from 'fast-xml-parser';
import { XMLDocument } from './data/xmlDocument';
import { XMLComponent, XMLElement, XMLNode } from './data/xmlNode';

type ParsedXMLAttribute<AttributeName extends string> = `@_${AttributeName}`;

type ParsedXMLAttributes<AttributeName extends string> = Record<ParsedXMLAttribute<AttributeName>, string>;

type ParsedXMlElementPartName<NodeName extends string> = {
  [key in NodeName]: ParsedXMLNode<string>[];
};

type ParsedXMlComponentPartName<NodeName extends string> = {
  [key in NodeName]: string;
};

type ParsedXMlNodePartAttributes<AttributeName extends string> = {
  ':@': ParsedXMLAttributes<AttributeName>;
};

type ParsedXMLElement<NodeName extends string, AttributeName extends string = string> =
  | ParsedXMlElementPartName<NodeName> & Partial<ParsedXMlNodePartAttributes<AttributeName>>;

type ParsedXMLComponent<NodeName extends string, AttributeName extends string = string> =
  | ParsedXMlComponentPartName<NodeName> & Partial<ParsedXMlNodePartAttributes<AttributeName>>;

type ParsedXMLNode<NodeName extends string, AttributeName extends string = string> =
  | ParsedXMLElement<NodeName, AttributeName>
  | ParsedXMLComponent<NodeName, AttributeName>;

const PARSED_XML_ATTRIBUTES_KEY = ':@';

const XML_OPTIONS: Partial<XmlBuilderOptions> & Partial<X2jOptions> = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  preserveOrder: true,
};

export class XML {
  constructor(
    private xmlParser: XMLParser = new XMLParser(XML_OPTIONS),
    private xmlBuilder: XMLBuilder = new XMLBuilder(XML_OPTIONS)
  ) {}

  parse = (xml: string): XMLDocument => {
    const parsedXmlNodes = this.xmlParser.parse(xml) as ParsedXMLNode<string>[];
    const nodes = parsedXmlNodes.map(this.parseNode);
    return new XMLDocument(nodes);
  };

  private parseNode = (node: ParsedXMLNode<string>): XMLNode => {
    const nodeKind = Object.keys(node).filter((key) => key !== PARSED_XML_ATTRIBUTES_KEY)[0];

    const parsedAttributes = this.parseAttributes(node[PARSED_XML_ATTRIBUTES_KEY]);

    const nodeChildren = node[nodeKind];

    if (typeof nodeChildren === 'string') {
      return new XMLElement(nodeKind, parsedAttributes, nodeChildren);
    } else {
      const parsedChildren = nodeChildren.map(this.parseNode);
      return new XMLComponent(nodeKind, parsedAttributes, parsedChildren);
    }
  };

  private parseAttributes = (attributes: Record<string, string> | undefined): Record<string, string> => {
    if (!attributes) return {};
    return Object.entries(attributes).reduce((parsedAttributes, [key, value]) => {
      const attributeName = key.replace(/^@_/, '') as string;

      let parsedValue;
      if (['version'].includes(attributeName)) {
        parsedValue = value;
      } else if (value.match(/^[0-9]+$/)) {
        parsedValue = parseInt(value, 10);
      } else if (value.match(/^[0-9]+\.[0-9]+$/)) {
        parsedValue = parseFloat(value);
      } else {
        parsedValue = value;
      }

      return {
        ...parsedAttributes,
        [attributeName]: parsedValue,
      };
    }, {});
  };

  print = (xmlDocument: XMLDocument): string => {
    const xmlNodes = xmlDocument.nodes.map(this.printNode);
    return this.xmlBuilder.build(xmlNodes);
  };

  private printNode = (xmlNode: XMLNode): ParsedXMLNode<string> => {
    const nodeKind = xmlNode.kind;

    const printedAttributes: Partial<ParsedXMlNodePartAttributes<string>> = this.printAttributes(xmlNode.attributes);

    let printedNode: ParsedXMLElement<string> | ParsedXMLComponent<string>;
    if (xmlNode instanceof XMLComponent) {
      printedNode = {
        [nodeKind]: xmlNode.children.map(this.printNode),
        ...printedAttributes,
      } as ParsedXMLComponent<string> & Partial<ParsedXMlNodePartAttributes<string>>;
    } else if (xmlNode instanceof XMLElement) {
      printedNode = {
        [nodeKind]: xmlNode.content,
        ...printedAttributes,
      } as ParsedXMLElement<string> & Partial<ParsedXMlNodePartAttributes<string>>;
    } else {
      throw new Error(`Unknown XML node type: ${xmlNode}`);
    }

    return printedNode;
  };

  printAttributes = (attributes: Record<string, string | number>): Partial<ParsedXMlNodePartAttributes<string>> => {
    const attributesCount = Object.keys(attributes).length;
    if (attributesCount === 0) return {};

    const printedAttributes = Object.entries(attributes).reduce((parsedAttributes, [key, value]) => {
      const attributeName = `@_${key}` as ParsedXMLAttribute<string>;
      return {
        ...parsedAttributes,
        [attributeName]: value.toString(),
      };
    }, {});

    return {
      [PARSED_XML_ATTRIBUTES_KEY]: printedAttributes,
    };
  };
}

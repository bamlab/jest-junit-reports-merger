export class XMLNode {
  constructor(public kind: string, public attributes: Record<string, string | number>) {}

  changeKind(kind: string) {
    this.kind = kind;
  }

  updateAttributes(attributes: Record<string, string>) {
    Object.entries(attributes).forEach(([value, key]) => {
      this.attributes[key] = value;
    });
  }
}

export class XMLComponent extends XMLNode {
  constructor(public kind: string, public attributes: Record<string, string | number>, public children: XMLNode[]) {
    super(kind, attributes);
  }
}

export class XMLElement extends XMLNode {
  constructor(public kind: string, public attributes: Record<string, string | number>, public content: string) {
    super(kind, attributes);
  }
}

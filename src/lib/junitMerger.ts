import { XMLDocument } from './data/xmlDocument';
import { XMLComponent, XMLElement } from './data/xmlNode';
import { XML } from './xml';

export class JUnitMerger {
  junitDocument: XMLDocument;

  testSuiteRecord: Record<string, XMLComponent> = {};

  constructor(private xmlModule: XML = new XML()) {
    const header = new XMLComponent('?xml', { version: '1.0', encoding: 'UTF-8' }, [new XMLElement('#text', {}, '')]);
    this.junitDocument = new XMLDocument([header]);
  }

  ingest(junitFilesContents: string[]) {
    for (const fileContent of junitFilesContents) {
      const newJunitDocument = this.xmlModule.parse(fileContent);
      const newTestsuites = newJunitDocument.findTopLevelComponent('testsuites');
      if (!newTestsuites) {
        continue;
      }
      this.appendTestsuites(newTestsuites);
    }
  }

  private appendTestsuites(newTestsuites: XMLComponent) {
    const name = newTestsuites.attributes.name;

    if (!name) {
      this.testSuiteRecord[Date.toString()] = newTestsuites;
    } else if (name in this.testSuiteRecord) {
      this.testSuiteRecord[name].children.push(...newTestsuites.children);
      const metrics = this.sumMetrics([this.testSuiteRecord[name].attributes, newTestsuites.attributes]);
      this.testSuiteRecord[name].attributes = metrics;
    } else {
      this.testSuiteRecord[name] = newTestsuites;
    }
  }

  private sumMetrics(metrics: Record<string, string | number>[]) {
    const result: Record<string, number> = {};

    for (const metric of metrics) {
      for (const [key, value] of Object.entries(metric)) {
        if (typeof value !== 'number') {
          continue;
        }
        if (key in result) {
          result[key] += value;
        } else {
          result[key] = value;
        }
      }
    }
    

    return result;
  }

  print() {
    let numberOfTestsuites = Object.keys(this.testSuiteRecord).length;

    let testsuites;
    switch (numberOfTestsuites) {
      case 0:
        break;
      case 1:
        testsuites = this.testSuiteRecord[Object.keys(this.testSuiteRecord)[0]];
        break;
      default:
        const attibutesList = Object.values(this.testSuiteRecord).map((testsuite) => testsuite.attributes);
        const resultingAttributes = {
          name: 'Jest Tests',
          ...this.sumMetrics(attibutesList),
        };
        Object.values(this.testSuiteRecord).forEach((testsuite) => testsuite.changeKind('testsuite'));
        testsuites = new XMLComponent('testsuites', resultingAttributes, Object.values(this.testSuiteRecord));
    }

    if (testsuites) {
      this.junitDocument.nodes.push(testsuites);
    }
    return this.xmlModule.print(this.junitDocument);
  }
}

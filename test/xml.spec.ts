import { XMLDocument } from '../src/lib/data/xmlDocument';
import { XMLComponent, XMLElement } from '../src/lib/data/xmlNode';

import { XML } from '../src/lib/xmlModule';

describe('xml', () => {
  it('should parse xml', () => {
    // given
    const junitXml = `<?xml version="1.0" encoding="UTF-8"?>
    <testsuites name="Jest Tests" tests="0" failures="0" errors="0" time="0">
        <testsuite name="jest" tests="0" failures="0" errors="0" time="0" timestamp="2021-03-01T16:00:00">
            <testcase name="test1" classname="test1" time="0.001"/>
        </testsuite>
    </testsuites>`;
    // when
    const xmlModule = new XML();
    const parsedXml = xmlModule.parse(junitXml);
    // then
    expect(parsedXml).toMatchSnapshot();
  });
  it('should print xml', () => {
    // given
    const parsedHeader = new XMLDocument([
      new XMLComponent('?xml', { version: '1.0', encoding: 'UTF-8' }, [new XMLElement('#text', {}, '')]),
    ]);
    // when
    const xmlModule = new XML();
    const printedXML = xmlModule.print(parsedHeader);
    // then
    expect(printedXML).toMatchSnapshot();
  });
});

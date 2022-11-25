import { JUnitMerger } from '../src/lib/junitMerger';
import { XMLParser, XMLBuilder, XmlBuilderOptions, X2jOptions } from 'fast-xml-parser';

const xml = function (strings: TemplateStringsArray, ...values: any[]) {
  const templateContent = String.raw({ raw: strings }, ...values);
  const XML_OPTIONS: Partial<XmlBuilderOptions> & Partial<X2jOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    preserveOrder: true,
    indentBy: '  ',
  };
  const parsedXML = new XMLParser(XML_OPTIONS).parse(templateContent);
  return new XMLBuilder(XML_OPTIONS).build(parsedXML);
};

describe('JUnit Merger', () => {
  it('should merge two JUnit files', () => {
    // Given
    const junitFile1 = xml`
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuites name="core/configuration" tests="2" failures="0" errors="0" time="0.053">
            <testsuite name="Configuration Service" tests="1" failures="0" errors="0" skipped="0" time="0.021" timestamp="2021-03-01T14:00:00">
                <testcase name="Configuration Service - should dynamicly load module" classname="Configuration Service - should dynamicly load module" time="0.001"/>
            </testsuite>
            <testsuite name="Configuration Parser" tests="1" failures="0" errors="0" skipped="0" time="0.011" timestamp="2021-03-01T14:00:00">
                <testcase name="Configuration Parser - should return parsed config" classname="Configuration Parser - should return parsed config" time="0.001"/>
            </testsuite>
        </testsuites>`;
    const junitFile2 = xml`
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuites name="core/auth" tests="1" failures="0" errors="0" time="0.025">
            <testsuite name="SuperImportantTokenValidator" tests="1" failures="0" errors="0" skipped="0" time="0.001" timestamp="2021-03-01T14:00:00">
                <testcase name="SuperImportantTokenValidator - expect true to be true" classname="SuperImportantTokenValidator - expect true to be true" time="0.001"/>
            </testsuite>
        </testsuites>`;
    // When
    const junitMerger = new JUnitMerger();
    junitMerger.ingest([junitFile1, junitFile2]);
    const mergedJunitFile = junitMerger.print();
    // Then
    const expectedJunitFile = xml`
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuites name="Jest Tests" tests="3" failures="0" errors="0" time="0.078">
            <testsuite name="core/configuration" tests="2" failures="0" errors="0" time="0.053">
                <testsuite name="Configuration Service" tests="1" failures="0" errors="0" skipped="0" time="0.021" timestamp="2021-03-01T14:00:00">
                    <testcase name="Configuration Service - should dynamicly load module" classname="Configuration Service - should dynamicly load module" time="0.001"/>
                </testsuite>
                <testsuite name="Configuration Parser" tests="1" failures="0" errors="0" skipped="0" time="0.011" timestamp="2021-03-01T14:00:00">
                    <testcase name="Configuration Parser - should return parsed config" classname="Configuration Parser - should return parsed config" time="0.001"/>
                </testsuite>
            </testsuite>
            <testsuite name="core/auth" tests="1" failures="0" errors="0" time="0.025">
                <testsuite name="SuperImportantTokenValidator" tests="1" failures="0" errors="0" skipped="0" time="0.001" timestamp="2021-03-01T14:00:00">
                    <testcase name="SuperImportantTokenValidator - expect true to be true" classname="SuperImportantTokenValidator - expect true to be true" time="0.001"/>
                </testsuite>
            </testsuite>
        </testsuites>`;
    expect(mergedJunitFile).toEqual(expectedJunitFile);
  });
});

import { select } from "d3-selection";
import { Subject } from "rxjs";

import { LinearScale } from "../core/common/scales/linear-scale";
import { TimeScale } from "../core/common/scales/time-scale";
import { D3Selection, IDataSeries, IRenderContainers, IRendererEventPayload } from "../core/common/types";
import { GRAYSCALE_FILTER } from "../core/types";

import { ISideIndicatorAccessors, SideIndicatorAccessors, SideIndicatorRenderer } from "./side-indicator-renderer";
import { IRenderSeries } from "./types";

describe("Side Indicator Renderer >", () => {

    let renderer: SideIndicatorRenderer;
    let accessors: ISideIndicatorAccessors;

    beforeEach(() => {
        renderer = new SideIndicatorRenderer();
        accessors = new SideIndicatorAccessors();
    });

    it("should have correct render layers", () => {
        const layers = renderer.getRequiredLayers();
        expect(layers.length).toBe(1);
        expect(-1 !== layers.findIndex(layer => layer.name === SideIndicatorRenderer.SIDE_INDICATORS_LAYER)).toEqual(true);
    });

    describe("draw()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let renderSeries: IRenderSeries<ISideIndicatorAccessors>;
        let xScale: TimeScale;
        let yScale: LinearScale;
        let dataSeries: IDataSeries<ISideIndicatorAccessors>;
        const containers: IRenderContainers = {};
        const rendererSubject = new Subject<IRendererEventPayload>();

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg").attr("height", 10);
            containers[SideIndicatorRenderer.SIDE_INDICATORS_LAYER] = svg.append("g");
            yScale = new LinearScale();
            xScale = new TimeScale();
            dataSeries = {
                "id": "series-1__error-0__side-indicator",
                "data": [{ active: true }],
                accessors,
                renderer,
            };
            renderSeries = {
                dataSeries,
                containers,
                scales: { x: xScale, y: yScale },
            };
        });

        it("should draw a 'rect' by default", () => {
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.selectAll("rect").nodes().length).toEqual(1);
        });

        it("should use the 'activeColor' accessor if 'active' is 'true'", () => {
            const expectedColor = "testColor";
            accessors.series.activeColor = () => expectedColor;
            dataSeries.data[0].active = true;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
        });

        it("should use the 'activeColor' accessor if 'active' is 'false', but 'inactiveColor' accessor is 'undefined'", () => {
            const expectedColor = "testColor";
            accessors.series.activeColor = () => expectedColor;
            accessors.series.inactiveColor = undefined;
            dataSeries.data[0].active = false;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
        });

        it("should use the 'inactiveColor' accessor if 'active' is 'false'", () => {
            const expectedColor = "testColor";
            accessors.series.inactiveColor = () => expectedColor;
            dataSeries.data[0].active = false;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
        });

        it("should use the 'inactiveColor' accessor if the data is empty", () => {
            const expectedColor = "testColor";
            accessors.series.inactiveColor = () => expectedColor;
            dataSeries.data = [];
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
        });

        it("should apply the grayscale filter if 'active' is false and 'inactiveColor' accessor is 'undefined'", () => {
            const expectedColor = "testColor";
            accessors.series.activeColor = () => expectedColor;
            accessors.series.inactiveColor = undefined;
            dataSeries.data[0].active = false;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
            expect(svg.select("rect").node().attributeStyleMap.get("filter").toString()).toEqual(GRAYSCALE_FILTER);
        });

        it("should not apply the grayscale filter if 'active' is false but 'inactiveColor' accessor is 'defined'", () => {
            const expectedColor = "testColor";
            accessors.series.inactiveColor = () => expectedColor;
            dataSeries.data[0].active = false;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("fill")).toEqual(expectedColor);
            expect(svg.select("rect").node().attributeStyleMap.get("filter")).toBeNull();
        });

        it("should set the 'rect' position and 'width'", () => {
            const startValue = 10;
            const endValue = 5;
            yScale.range([0, startValue]);
            yScale.fixDomain([0, startValue]);
            accessors.series.start = () => startValue;
            accessors.series.end = () => endValue;
            const expectedWidth = 2;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("x")).toEqual(`-${expectedWidth}`);
            expect(svg.select("rect").attr("y")).toEqual(yScale.convert(endValue).toString());
            expect(svg.select("rect").attr("width")).toEqual(expectedWidth.toString());
        });

        it("should calculate the 'rect' height based on the zone series 'start' and 'end' values", () => {
            const startValue = 10;
            const endValue = 5;
            yScale.range([0, startValue]);
            yScale.fixDomain([0, startValue]);
            accessors.series.start = () => startValue;
            accessors.series.end = () => endValue;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("height")).toEqual(Math.min(yScale.range()[0], yScale.convert(startValue)).toString());
        });

        it("should calculate the 'rect' size based on the 'start' and 'end' and not extend past the bottom line of the chart", () => {
            const startValue = -100;
            const endValue = 5;
            yScale.range([0, startValue]);
            yScale.fixDomain([0, startValue]);
            accessors.series.start = () => startValue;
            accessors.series.end = () => endValue;
            renderer.draw(renderSeries, rendererSubject);
            const result = (yScale.convert(startValue) < 0 ? 0 : yScale.convert(startValue) - yScale.convert(endValue)).toString();
            expect(svg.select("rect").attr("height")).toEqual(result);
        });

        it("should calculate the 'rect' height based on the initial range value and 'end' value if the start accessor result is 'undefined'", () => {
            const startValue = 10;
            const endValue = 5;
            yScale.range([startValue, 0]);
            yScale.fixDomain([0, startValue]);
            accessors.series.start = () => undefined;
            accessors.series.end = () => endValue;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("height")).toEqual((yScale.range()[0] - yScale.convert(endValue)).toString());
        });

        it("should use a value of zero for the top of the 'rect' if the end accessor result is 'undefined'", () => {
            const startValue = 10;
            yScale.range([startValue, 0]);
            yScale.fixDomain([0, startValue]);
            accessors.series.start = () => startValue;
            accessors.series.end = () => undefined;
            renderer.draw(renderSeries, rendererSubject);
            expect(svg.select("rect").attr("y")).toEqual("0");
            expect(svg.select("rect").attr("height")).toEqual((yScale.convert(startValue) - 0).toString());
        });

    });
});

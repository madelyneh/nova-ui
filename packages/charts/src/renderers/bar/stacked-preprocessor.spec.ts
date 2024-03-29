import { BandScale } from "../../core/common/scales/band-scale";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { IChartSeries } from "../../core/common/types";

import { IBarAccessors } from "./accessors/bar-accessors";
import { VerticalBarAccessors } from "./accessors/vertical-bar-accessors";
import { BarRenderer } from "./bar-renderer";
import { stackedPreprocessor } from "./stacked-preprocessor";

const allVisible = (series: IChartSeries<IBarAccessors>) => true;
const allExceptSecondVisible = (series: IChartSeries<IBarAccessors>) => series.id !== "1";

const seriesGenerator = (data: (string | number)[][][]): IChartSeries<IBarAccessors>[] => {
    const accessors = new VerticalBarAccessors();
    const renderer = new BarRenderer();
    const scales: any = {
        x: new BandScale(),
        y: new LinearScale(),
    };
    return data.map((innerData: (string | number)[][], index: number) => ({
        id: `${index}`,
        name: `Mocked Series ${index}`,
        accessors,
        renderer,
        scales,
        data: innerData.map(d => ({
            category: d[0],
            value: d[1],
        })),
    }));
};

const validSeriesData = [
    [["Cat 1", 23], ["Cat 2", 21], ["Cat 3", 4]],
    [["Cat 1", 700], ["Cat 2", 0], ["Cat 3", 4]],
];
const sparseSeriesData = [
    [["Cat 1", 23], ["Cat 2", 21], ["Cat 3", 4]],
    [["Cat 1", 700], ["Cat 2", 0], ["Cat 4", 4]],
];
const sparseSeriesDataWithSecondSeriesThatCanBeHidden = [
    [["Cat 1", 23], ["Cat 2", 21], ["Cat 3", 4]],
    [],
    [["Cat 1", 700], ["Cat 2", 0], ["Cat 4", 4]],
];

describe("stacked preprocessor", () => {
    it("should return the same empty array", () => {
        const series: any = [];
        expect(stackedPreprocessor(series, allVisible)).toBe(series);
    });
    it("should not add metadata to all items in sparse dataset", () => {
        const preprocessed = stackedPreprocessor(seriesGenerator(sparseSeriesData), allVisible);
        const barMetadata = preprocessed.map(s => s.data.map(d => d.__bar));
        expect(barMetadata)
            .toEqual([
                [{ "start": 0, "end": 23 }, { "start": 0, "end": 21 }, { "start": 0, "end": 4 }],
                [{ "start": 23, "end": 723 }, { "start": 21, "end": 21 }, { "start": 0, "end": 4 }]]);
    });
    it("should not add 0 metadata to items in invisible series", () => {
        const preprocessed = stackedPreprocessor(seriesGenerator(sparseSeriesDataWithSecondSeriesThatCanBeHidden), allExceptSecondVisible);
        const barMetadata = preprocessed.map(s => s.data.map(d => d.__bar));
        expect(barMetadata)
            .toEqual([
                [{ "start": 0, "end": 23 }, { "start": 0, "end": 21 }, { "start": 0, "end": 4 }],
                [],
                [{ "start": 23, "end": 723 }, { "start": 21, "end": 21 }, { "start": 0, "end": 4 }],
            ]);
    });
});

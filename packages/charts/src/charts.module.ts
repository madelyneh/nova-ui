import { OverlayModule } from "@angular/cdk/overlay";
import { NgModule } from "@angular/core";
// This is not technically used here, but it does pull in the type for $localize
import { LocalizeFn } from "@angular/localize/init";
import { NuiCommonModule, NuiIconModule, NuiPopoverModule } from "@solarwinds/nova-bits";
import "d3-selection-multi";

import { ChartCollectionIdDirective } from "./chart-collection/chart-collection-id.directive";
import { ChartCollectionService } from "./chart-collection/chart-collection.service";
import { ChartDonutContentComponent } from "./chart-donut-content/chart-donut-content.component";
import { ChartMarkerComponent } from "./chart-marker/chart-marker.component";
import { ChartPopoverComponent } from "./chart-popover/chart-popover.component";
import { ChartTooltipComponent } from "./chart-tooltips/chart-tooltip.component";
import { ChartTooltipDirective } from "./chart-tooltips/chart-tooltip.directive";
import { ChartTooltipsComponent } from "./chart-tooltips/chart-tooltips.component";
import { ChartComponent } from "./chart/chart.component";
import { GaugeComponent } from "./gauge/gauge.component";
import { LegendSeriesComponent } from "./legend/legend-series/legend-series.component";
import { BasicLegendTileComponent } from "./legend/legend-tile/basic-legend-tile/basic-legend-tile.component";
import { RichLegendTileComponent } from "./legend/legend-tile/rich-legend-tile/rich-legend-tile.component";
import { LegendComponent } from "./legend/legend.component";
import { ThresholdsService } from "./thresholds/thresholds-service";

@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiPopoverModule,
        OverlayModule,
    ],
    declarations: [
        LegendComponent,
        LegendSeriesComponent,
        BasicLegendTileComponent,
        RichLegendTileComponent,
        ChartComponent,
        ChartCollectionIdDirective,
        ChartMarkerComponent,
        ChartPopoverComponent,
        ChartDonutContentComponent,
        ChartTooltipsComponent,
        ChartTooltipComponent,
        ChartTooltipDirective,
        GaugeComponent,
    ],
    exports: [
        LegendComponent,
        LegendSeriesComponent,
        RichLegendTileComponent,
        BasicLegendTileComponent,
        ChartComponent,
        ChartCollectionIdDirective,
        ChartMarkerComponent,
        ChartPopoverComponent,
        ChartDonutContentComponent,
        ChartTooltipsComponent,
        ChartTooltipComponent,
        ChartTooltipDirective,
        GaugeComponent,
    ],
    providers: [
        ChartCollectionService,
        ThresholdsService,
    ],
    entryComponents: [
        ChartTooltipComponent,
    ],
})
export class NuiChartsModule {
}

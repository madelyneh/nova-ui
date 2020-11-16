import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN } from "@solarwinds/nova-bits";

const exampleRoutes: Routes = [
    {
        path: "tooltips",
        loadChildren: () => import("components/demo/plugins/tooltips/chart-docs-tooltips.module").then(m => m.ChartDocsTooltipsModule),
    },
    {
        path: "popovers",
        loadChildren: () => import("components/demo/plugins/popovers/chart-docs-popovers.module").then(m => m.ChartDocsPopoversModule),
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsPluginsModule {
}

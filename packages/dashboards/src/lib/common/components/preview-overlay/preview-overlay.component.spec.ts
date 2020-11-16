import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../dashboards.module";

import { PreviewOverlayComponent } from "./preview-overlay.component";

describe("PreviewOverlayComponent", () => {
    let component: PreviewOverlayComponent;
    let fixture: ComponentFixture<PreviewOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ NuiDashboardsModule ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

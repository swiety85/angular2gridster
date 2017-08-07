import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {GridsterComponent} from '../gridster/gridster.component';
import {IGridsterOptions} from '../gridster/IGridsterOptions';
import { Subscription } from 'rxjs/Subscription';
import {DashboardService} from '../dashboard.service';

@Component({
    selector: 'a2g-gridster-configurator',
    templateUrl: './gridster-configurator.component.html',
    styleUrls: ['./gridster-configurator.component.scss']
})
export class GridsterConfiguratorComponent implements OnInit, OnDestroy {

    @Input() gridster: GridsterComponent;

    gridsterOptions: IGridsterOptions;

    private subscribtions: Array<Subscription> = [];

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.subscribtions.push(this.gridster.gridsterOptions.change
            .subscribe((options: IGridsterOptions) => this.gridsterOptions = options));
    }

    lanesChange(lanes: number) {
        this.gridsterOptions.lanes = lanes;
        this.gridster.setOption('lanes', lanes)
            .reload();
    }

    ratioChange(ratio: number) {
        this.gridsterOptions.widthHeightRatio = ratio;
        this.gridster.setOption('widthHeightRatio', ratio)
            .reload();
    }


    ngOnDestroy() {
        this.subscribtions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    resetOptions () {
        this.dashboardService
            .resetOptions()
            .store();
    }

    resetWidgets () {
        this.dashboardService
            .resetWidgets()
            .store();
    }
}

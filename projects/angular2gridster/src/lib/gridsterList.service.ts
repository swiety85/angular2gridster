import { GridsterComponent } from './gridster.component';
import { GridsterService } from './gridster.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GridsterListService {
    girdsters: Set<GridsterComponent> = new Set();

    getGridstersBySelector(selector: string): GridsterComponent[] {
        return Array.from(this.girdsters).filter((girdster: GridsterComponent) => {
            return girdster.$element.matches(selector);
        });
    }
}

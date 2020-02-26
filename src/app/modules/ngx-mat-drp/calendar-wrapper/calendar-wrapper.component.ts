import {
  Component,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { ConfigStoreService } from '../services/config-store.service';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'calendar-wrapper',
  templateUrl: './calendar-wrapper.component.html',
  styleUrls: ['./calendar-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWrapperComponent implements OnChanges {
  @ViewChild(MatCalendar)
  matCalendar: MatCalendar<Date>;
  

  @Output()
  readonly selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  dateFormat: string;
  clearLabel: string;
  @Input() selectedDate: Date;
  @Input() prefixLabel: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  weekendFilter = (d: Date) => true;

  selectedTime: string;

  constructor(private configStore: ConfigStoreService) {
    this.dateFormat = configStore.ngxDrpOptions.format;
    this.clearLabel = configStore.ngxDrpOptions.clearLabel || 'Clear';
    if (configStore.ngxDrpOptions.excludeWeekends) {
      this.weekendFilter = (d: Date): boolean => {
        const day = d.getDay();
        return day !== 0 && day !== 6;
      };
    }
  }

  ngOnInit() {
    this.selectedTime = this.selectedDate.toLocaleTimeString();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    // Necessary to force view refresh
    if (changes.selectedDate.currentValue) {
      this.matCalendar.activeDate = changes.selectedDate.currentValue;
      if(this.selectedTime) {
        let timeArr: number[] = this.timeStringToIntArray(this.selectedTime);
        this.selectedDate.setHours(timeArr[0], timeArr[1]);
      }
    }
    this.matCalendar.selected = changes.selectedDate.currentValue;
    
  }

  onSelectedChange(date) {
    this.selectedDate = date;
    this.selectedDateSetHours(this.selectedTime);
    this.selectedDateChange.emit(this.selectedDate);
  }

  onTimeChange($event) {
    this.selectedTime = $event.target.value;
    this.selectedDateSetHours(this.selectedTime);
  }

  timeStringToIntArray(timeStr: string): number[] {
    let timeArr: string[] = timeStr.split(':');
    let timeIntArr: number[] = [];
    timeIntArr[0] = parseInt(timeArr[0]);
    timeIntArr[1] = parseInt(timeArr[1]);
    timeIntArr[2] = parseInt(timeArr[2]);
    return timeIntArr;
  }
  selectedDateSetHours(time: string) {
    let timeArr: number[] = this.timeStringToIntArray(time);
    this.selectedDate.setHours(timeArr[0], timeArr[1]);
  }

  onYearSelected(e) {}

  onUserSelection(e) {}

  clear() {
    this.selectedDate = null;
    this.onSelectedChange(this.selectedDate);
  }
}

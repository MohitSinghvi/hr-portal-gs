import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {

  @Input()
  // data = [ 
  //   {
  //     "value" : "Sales",
  //     "date_range": "2000-12-09 - 2002-10-05",
  //   },
  //   {
  //     "value" :"HR" ,
  //     "date_range": "2002-10-06 - 2005-10-05",
  //   },
  //   {
  //     "value" :"Engineering" ,
  //     "date_range": "2005-10-06 - present",
  //   }
  // ];
  data: any;
  heading: any;

  @Input() key = 'val';
}

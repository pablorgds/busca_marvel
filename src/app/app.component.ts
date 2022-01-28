import { Component, OnInit } from '@angular/core';

import { environment } from '../environments/environment';
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Logger} from "./core/logger.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private logger: Logger) {}
  title = '';
  version = '';

  ngOnInit() {
    this.title = environment.settings.appTitle;
    this.version = environment.settings.version;
  }


}

import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit {
  description;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private course: Course,
    private dialogRef: MatDialogRef<CourseDialogComponent>
  ) {}
  form = this.fb.group({
    description: ["", Validators.required],
    category: ["BEGINNER", Validators.required],
    releasedAt: [new Date(), Validators.required],
    longDescription: [this.course.longDescription, Validators.required],
  });
  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
  ngOnInit() {}
}

export function openCourseDialog(dialog: MatDialog, course: Course) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;

  config.data = {
    ...course,
  };

  const dialogConfig = dialog.open(CourseDialogComponent, config);
  return dialogConfig.afterClosed();
}

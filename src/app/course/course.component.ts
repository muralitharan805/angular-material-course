import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  catchError,
  finalize,
} from "rxjs/operators";
import { merge, fromEvent, throwError } from "rxjs";
import { Lesson } from "../model/lesson";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;

  @ViewChild(MatPaginator)
  pagination: MatPaginator;

  @ViewChild(MatSort)
  matSort: MatSort;
  lessons: Lesson[] = [];
  loading = false;

  selection = new SelectionModel<Lesson>(true, []);

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  isAllSelected() {
    return this.selection.selected.length == this.lessons.length;
  }
  onLessonSelected(lessons: Lesson) {
    this.selection.toggle(lessons);

    console.log(this.selection.selected);

    // this.selection.isSelected;
  }

  toggleAll() {
    // console.log("clicked");

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.lessons);
    }
  }
  displayedColumns = ["select", "seqNo", "description", "duration"];

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadLessonsPage();
  }

  loadLessonsPage() {
    this.loading = true;
    this.coursesService
      .findLessons(
        this.course.id,
        this.matSort?.direction ?? "asc",
        this.pagination?.pageIndex ?? 0,
        this.pagination?.pageSize ?? 3,
        this.matSort?.active ?? "seqNo"
      )
      .pipe(
        tap((lessons) => (this.lessons = lessons)),
        catchError((err) => {
          console.log("err loading lessons api", err);

          alert("err loading lessons api");
          return throwError(err);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.matSort.sortChange.subscribe(() => this.pagination.pageIndex == 0);
    merge(this.matSort.sortChange, this.pagination.page)
      .pipe(tap(() => this.loadLessonsPage()))
      .subscribe();
  }
}

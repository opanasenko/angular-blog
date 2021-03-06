import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {switchMap} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

class PostService {
}

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  form: FormGroup
  // @ts-ignore
  post: Post
  submitted = false
  // @ts-ignore
  uSub: Subscription
  uPost = true

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params: Params) => {
        return this.postsService.getById(params['id'])
      })).subscribe((post: Post) => {
        // @ts-ignore
      this.post = post
      this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          content: new FormControl(post.content, Validators.required)
        })
    })
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true

    this.postsService.update({
      ...this.post,
      content: this.form.value.content,
      title: this.form.value.title
    }).subscribe(() => {
      this.submitted = false
      this.alert.warning('Post updated')
      this.uPost = false
    })
  }

  uPostOpen(id: any) {
    this.router.navigate(['/post', `${id}`])
  }
}

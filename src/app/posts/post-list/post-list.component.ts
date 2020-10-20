import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';  // to store subscription created below
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {  // implement lifecycles 
  // @Input() posts: Post[] = [];  // apply input decorator to listen for event from parent app; posts is now bound; also acts as conditional for directives in this html component
  
  // define props
  posts: Post[] = [];
  isLoading = false;
  // dummy value for pagination
  totalPosts = 0; 
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription; // type for storing subscription

  // dependency injection of our service:
  constructor(public postsService: PostsService) {}

  // define lifecycle method and call service getter
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);  // get a list even though empty at start; add pagination params

    // subscribe to postsService Subject and save to postsSub (rxjs Subscription)
    this.postsSub = this.postsService.getPostUpdateListener() // getPostsUpdateListener = my custom method
    .subscribe((postData: {posts: Post[], postCount: number}) => {  
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });  
  }
  // pagination method
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;  // set spinner
    this.currentPage = pageData.pageIndex + 1 // pageData arg gets passed as $event from template
    this.postsPerPage = pageData.pageSize; 
    this.postsService.getPosts(this.postsPerPage, this.currentPage);  // with dynamic pagination query params
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }); 
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();  // in order to prevent mem leaks
  }
};
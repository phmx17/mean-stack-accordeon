import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';  // to store subscription created below

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
  private postsSub: Subscription; // type for storing subscription

  // dependency injection of our service:
  constructor(public postsService: PostsService) {}

  // define lifecycle method and call service getter
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();  // get a list even though empty at start 

    // subscribe to postsService Subject and save to postsSub (rxjs Subscription)
    this.postsSub = this.postsService.getPostUpdateListener() // getPostsUpdateListener = my custom method
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });  
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();  // in order to prevent mem leaks
  }
};
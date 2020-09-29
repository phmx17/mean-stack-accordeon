import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'; // emitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// makes this service available at the root level
@Injectable({providedIn: 'root'}) // used this instead of registering in app.module; creates only one instance for enire app.

export class PostsService {
  // props
  private posts: Post[] = []; 

  // define new emitter that carries Post[] as payload
  private postsUpdated = new Subject<Post[]>(); // define new emitter that carries Post[] payload

  constructor(private http: HttpClient, private router: Router) {};

  // methods
  getPosts() {
    this.http.get<{message: string, posts: any []}> ('http://localhost:3000/api/posts')
    // adding pipe operator map()
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    })) 
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  };

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();  // make observable to other components
  }

  // get api single post for editing and update on page reload; returns to become an observable in post-create.ts
  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${id}`)
  }

  // create post
  addPost(title: string, content: string) {
    let post: Post = {id: null, title, content} // ES6
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData.message);
      post = {...post, id: responseData.postId} // adding mongoose _id that came back from API in order to update post-list
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]) // rsJx emit new value and create copy
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string) {
     const post: Post = {id, title, content}
     this.http
     .put(`http://localhost:3000/api/posts/${id}`, post)
     .subscribe((response) => {
       // insert the edited post into the same index of posts []
       const updatedPosts = [...this.posts];
       const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id); 
       updatedPosts[oldPostIndex] = post;
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
       this.router.navigate(['/']);
     });
  };

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);      
      this.postsUpdated.next([...this.posts]);
    });
  };
}; 
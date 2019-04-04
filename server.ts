import fetch from "node-fetch";
import { Observable } from "rxjs";
import { map, observeOn, concatMap } from "rxjs/operators";

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

type Result = Post[];

const getData$ = new Observable<Result>((observer) => {
    console.log("fetching data");
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((json: Result) => {
            observer.next(json);
            observer.complete();
        })
        .catch((error) => observer.error(error));
});

const postData = async (post: Post): Promise<Post> => {
    console.log("posted data");
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "post",
            body: JSON.stringify(post),
            headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        return json;
    }
    catch (error) {
        console.log(error);
    }
}

// const postData$ = new Observable((observer) => {
//     const payload: Post = {
//         userId: 100,
//         id: 50,
//         title: "A test payload",
//         body: "a longer description of a test payload",
//     };
//     fetch("https://jsonplaceholder.typicode.com/posts", {
//         method: "post",
//         body: JSON.stringify(payload),
//         headers: { "Content-Type": "application/json" },
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         observer.next(data);
//         observer.complete();
//     })
//     .catch((error) => {
//         observer.error(error);
//     })
// });

getData$.pipe(
    concatMap((posts) => postData(posts[0])),
    // ((source) => {
    //     source.subscribe((data) => console.log(data));
    //     return source;
    // })
    concatMap((post) => postData(post))
).subscribe((data) => console.log(data));

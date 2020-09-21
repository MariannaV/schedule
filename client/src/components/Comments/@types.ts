export namespace IComments {
  export interface Widget {
    comments?: List['comments'];
    onCommentCreate?: Item['onCommentCreate'];
    classes?: {
      container?: string;
    };
  }

  export interface Item {
    comment?: Comment;
    isReadOnly?: boolean;
    onCommentCreate?: (formValues: Comment) => void;
  }

  export interface List {
    comments: Array<Comment>;
  }

  export interface Comment {
    commentId: string;
    created: string;
    updated?: string;
    message?: string;
    author: string;
  }
}

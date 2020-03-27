import * as React from "react";
import {Component} from "react";

export default class CommentListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentList: []
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        commentList: [
          {
            id: 0,
            author: "小明",
            body: "这是小明写的文章"
          },
          {
            id: 1,
            author: "小红",
            body: "这是小红写的文章"
          }
        ]
      });
    }, 1000);
  }
  render() {
    const {commentList} = this.state;
    return (
      <div>
        <h1>CommentListPage</h1>
        {commentList.map(item => {
          return <Comment key={item.id} data={item} />;
        })}
      </div>
    );
  }
}

class Comment extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // true false
    const {author, body} = this.props.data;
    const {author: newAuthor, body: newBody} = nextProps.data;
    if (newAuthor === author && body === newBody) {
      return false;
    }
    return true;
  }
  render() {
    const {author, body} = this.props.data;
    console.log("render"); //sy-log
    return (
      <div className="border">
        <p>{author}</p>
        <p>{body}</p>
      </div>
    );
  }
}

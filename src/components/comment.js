import React, { Component } from 'react';
import * as actions from '../actions'
import { connect } from 'react-redux'
import * as api from '../api'

class Comment extends Component {
  constructor(props) {
    super(props);
    this.setState({component: "Comment"});
  }

  upvoteComment() {
    fetch("http://localhost:3001/comments/" + this.props.comment.id + "?option=upVote",
    {method: "POST", body:JSON.stringify({option: "upVote"}), headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.UPVOTE_COMMENT,
          id: this.props.comment.id,
          voteScore: data.voteScore
        }

        this.props.upvote_comment(obj);
        this.forceUpdate();
        if(this.props.sortChanged){
          this.props.sortChanged();
        }
      })
    })
  }

  downvoteComment() {
    fetch("http://localhost:3001/comments/" + this.props.comment.id,
    {method: "POST", body:JSON.stringify({option: "downVote"}), headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.DOWNVOTE_COMMENT,
          id: this.props.comment.id,
          voteScore: data.voteScore
        }

        this.props.downvote_comment(obj);
        this.forceUpdate();
        if(this.props.sortChanged){
          this.props.sortChanged();
        }
      })
    })
  }

  render(){
    return (
      <div className="comment">
        <h4>{this.props.comment.body}</h4>
        <p>Vote Score: {this.props.comment.voteScore}</p>
        <br/>
        <p>
          By: <em>{this.props.comment.author}</em><br />
          {"Date"}: {new Date(this.props.comment.timestamp).toString().substr(0,16)}<br/><br />
        </p>
        <div className="post-buttons-div">
          <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.upvoteComment()}}>UpVote</button>
          <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.downvoteComment()}}>DownVote</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ posts, comments }) {
  return {
    posts,
    comments
  }
}

function mapDispatchToProps (dispatch) {
  return {
    upvote_comment: (data) => dispatch(actions.upvote_comment(data)),
    downvote_comment: (data) => dispatch(actions.downvote_comment(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comment)

import React from 'react';

class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: '',
      annotation: '',
      height: '',
      width: '',
      fileName: '',
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.annotationSubmit = this.annotationSubmit.bind(this);
  }

  handleUploadImage(event) {
    event.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: data,
    }).then((res) => {
      res.json().then((body) => {
        this.setState({ 
          imageURL: `http://localhost:5000/static/upload/${body.filename}`,
          fileName: body.filename
        });
      });
    });
  }

  handleHeightChange(event) {
    event.preventDefault();
    this.setState({height: event.target.value});
  }
  handleAnnotationChange(event) {
    event.preventDefault();
    this.setState({height: event.target.value});
  }
  handleWidthChange(event) {
    event.preventDefault();
    this.setState({width: event.target.value});
  }
  annotationSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append('annotation', this.annotation.value);
    fetch(`http://localhost:5000/annotate/${this.state.fileName}`, {
      method: 'POST',
      body: data,
    }).then((res) => {
      res.json().then((body) => {
        this.setState({ 
          annotation: body.annotation,
        });
      });
    });

  }

  render() {
    return (
      <div className = "container">
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            <button>Upload</button>
          </div>
        </form>
        {this.state.imageURL !== '' &&
        <div>
          <form className="textForm" onSubmit={this.annotationSubmit}>
            <div>
              Annotation: 
              <input ref={(ref) => { this.annotation = ref; }} type="text" placeholder="Annotation"/>
              <button>Submit</button>
            </div>
            <div>Width: <input type="text" placeholder="width" value={this.state.width} onChange={this.handleWidthChange}/></div>
            <div>Height: <input type="text" placeholder="width" value={this.state.height} onChange={this.handleHeightChange}/></div>
          </form>
          <div className="imageContainer"> 
                <img src={this.state.imageURL} width={this.state.width} height={this.state.height} alt="img" />
          </div>
          <div>
            {this.state.annotation !== '' && 
                <p>Annotation: {this.state.annotation}</p>}
          </div>
        </div>}
      </div>
    );
  }
}

export default UploadImage;

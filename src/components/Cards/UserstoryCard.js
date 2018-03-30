import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Components from 'react';
import { Route, Link } from 'react-router-dom';
import { serviceurl } from "../../config/serviceurl";
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faLock, faGlobe, faUsers, faSortDown } from '@fortawesome/fontawesome-free-solid'
import { isAdmin, isEditor } from '../../utility.js'

class UserstoryCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            image: props.imageA,
            open: false,
            dropdownStyle: {width: '261px', left: 'auto', right: '0'},
            published: props.story.published,
            saving: false
        }
    }

    async loadImage(widget) {
        let url = serviceurl.apiURLDatiGov +'/plot/' + widget + '/330x280';
        const response = await fetch(url, {
            method: 'GET'
        })

        return response
    }

    async save(story) {
        story['timestamp'] = new Date(); 
        console.log('Salvataggio story: ' + story);
        const response = await fetch( serviceurl.apiURLDatiGov  + "/save/user-stories", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(story)
        })
        
        return response.json();
    }

    saveStory(status){
        const { story } = this.props
        story.published = status
        let response = this.save(story)
        this.setState({
            saving: true,
            open: !this.state.open
        })
        response.then(json => {
            this.setState({
                saving: false,
                published: status
            })
        })
    }

    componentDidMount(){
        const { imageA, widgetA, id } = this.props
        if (imageA === 'noimage'){
            const responseA = this.loadImage(widgetA)
                .then(response => {
                    if (response.ok) {
                        response.text().then(text => {
                            this.setState({
                                loading: false,
                                image: text.replace(/"/g, '')
                            })
                        });
                    } else {
                        this.setState({
                            loading: false,
                            image: imageA
                        })
                    }
                })
        }
    }

    openVisibility(){
        const { id } = this.props
        this.setState({
            open: !this.state.open
        })
        let dropdown = document.querySelector('#dropdown_'+id)
        let info = dropdown.getClientRects()
        
        if(info[0].bottom > 800 || window.location.hash === '#/home')
            this.setState({
                dropdownStyle: {width: '261px', left: 'auto', right: '0', top: '0', transform: `translate(${0}px, ${-285}px)`}
            })
        else
            this.setState({
                dropdownStyle: {width: '261px', left: 'auto', right: '0'}
            })
    }

    render(){
        const { story, imageA, time, id } = this.props
        const { image, open, dropdownStyle, published } = this.state

        const iframeStyle = {
            width: '100%',
            height: '160px',
            border: '0'
        }

        var active = open? ' active' : ''
        var show = open? ' show': ''
        return(
            <div className="mx-auto">
                <div className="card b-a-0 border-primary bg-white card-story">
                    <div className="card-img-top" style={iframeStyle}>
                        <div className="row m-0">
                            {imageA && <div className="crop col-12"><img src={"data:image/jpg;base64," + image} /></div>}
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="title-dash">
                            <Link to={"/user_story/list/" + story.id}>
                                <h3 className="card-title text-primary">{story.title}</h3>
                            </Link>
                        </div>
                        <div className="card-text row m-0 mt-3 ml-4">
                            <p className="col-8 pl-0 m-0">{story.user}</p>
                            <div className="col-4">
                                <div className={"fa-pull-right dropdown" + show }>
                                {this.state.saving ? <i className="fa fa-spin fa-circle-notch text-icon"/> :
                                    <button className={"btn-status text-icon text-center"+active} id={'dropdown_'+id} data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false" onClick={this.openVisibility.bind(this)}>

                                        <FontAwesomeIcon icon={faSortDown} className="pull-left"/>
                                        
                                    {
                                        published == 2 &&
                                        //<span className="badge badge-pill badge-warning fa-pull-right badge-dash" title="Pubblica"> </span>
                                        //<i className="fa fa-globe fa-pull-right fa-lg text-icon" title='Pubblica'/>
                                        <span title="Open Data" className="ml-2"><FontAwesomeIcon icon={faGlobe} className="mx-auto" /></span>
                                    }
                                    {
                                        published == 1 &&
                                        //<span className="badge badge-pill badge-success fa-pull-right badge-dash" title="Condivisa"> </span>
                                        //<i className="fa fa-users fa-lg fa-pull-right text-icon" title="Condivisa"/>
                                        <span title="Organizzazione" className="ml-2"><FontAwesomeIcon icon={faUsers} className="mx-auto" /></span>
                                    }
                                    {
                                        !published &&
                                        //<span className="badge badge-pill badge-secondary fa-pull-right badge-dash" title="In bozza"> </span>
                                        //<i className="fa fa-lock fa-lg fa-pull-right text-icon" title="In Bozza"/>
                                        <span title="Privata" className="ml-2"><FontAwesomeIcon icon={faLock} className="mx-auto"/></span>
                                    }

                                    </button>}
                                    <div className={"dropdown-menu dropdown-menu-right m-0" + show} style={dropdownStyle} aria-labelledby="dropdownMenuButton">
                                        <h6 className="dropdown-header bg-white"><b>CHI PUÒ VISUALIZZARE?</b></h6>
                                        <button className="dropdown-item bg-light b-l-pvt" onClick={this.saveStory.bind(this, 0)}>
                                            
                                            
                                            <div className="row">
                                                <h5 className="col-1 pl-0"><FontAwesomeIcon icon={faLock} className="mx-2"/></h5>
                                                <div className="row col-11 ml-1">
                                                    <div className="col-12 pl-1"><p className="mb-0"><b>Solo tu</b></p></div>
                                                    
                                                    <div className="col-12 pl-1">Contenuto privato</div>
                                                </div>
                                                
                                            </div>
                                            
                                        </button>
                                        <button className="dropdown-item bg-light b-l-org" onClick={this.saveStory.bind(this, 1)}>
                                            <div className="row">
                                                <h5 className="col-1 pl-0"><FontAwesomeIcon icon={faUsers} className="mx-2"/></h5>
                                                <div className="row col-11 ml-1">
                                                    <div className="col-12 pl-1"><p className="mb-0"><b>Organizzazione</b></p></div>
                                                    
                                                    <div className="col-12 pl-1">Contenuto visibile ai membri <br/>della tua organizzazione</div>
                                                </div>
                                            </div>
                                        </button>
                                        {story.pvt!=1 &&(isEditor() || isAdmin()) && <button className="dropdown-item bg-light b-l-open" onClick={this.saveStory.bind(this, 2)}>
                                        
                                            <div className="row">
                                                <h5 className="col-1 pl-0"><FontAwesomeIcon icon={faGlobe} className="mx-2"/></h5>
                                                <div className="row col-11 ml-1">
                                                    <div className="col-12 pl-1"><p className="mb-0"><b>Open data</b></p></div>
                                                    
                                                    <div className="col-12 pl-1">Contenuto visibile a <br/>chiunque, visibile sul <br/>dataportal pubblico </div>
                                                </div>
                                            </div>
                                        </button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* story.pvt == 1 &&
                            <div className="badge badge-danger pull-left mt-20"><i className="fa fa-lock fa-lg m-t-2"></i> PRIVATA</div> */
                        }
                    </div>
                    <div className="b-t-story py-2 footer-dash">
                        <div className="pt-1 row">
                            <div className="card-text col-8"><i className="fas fa-clock text-icon pr-2"></i> {time?Math.ceil(time):0} min. di lettura</div>
                        </div>
                    </div>
                </div>
              </div >
        )
    }
}

export default UserstoryCard;
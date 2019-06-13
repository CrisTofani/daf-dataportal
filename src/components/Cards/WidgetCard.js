import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { transformWidgetName, truncateWidgetTitle, transformDatasetName } from "../../utility";
import { serviceurl } from "../../config/serviceurl";


class WidgetCard extends Component {
    constructor(props){
        super(props)
        var url = ''

        if(props.iframe.identifier)
            url = serviceurl.urlCacher  + props.iframe.identifier + '.png';
        if(props.iframe.props)
            url = serviceurl.urlCacher  + props.iframe.props.identifier + '.png';

        this.state = {
            url: url,
            onError: false
        }

        this.isSuperset = this.isSuperset.bind(this)
        this.isMetabase = this.isMetabase.bind(this)
        this.onImgError = this.onImgError.bind(this)
    }

    isSuperset(){
        const { iframe } = this.props
        if((iframe.identifier && iframe.identifier.indexOf('superset')!== -1) || (iframe.props && iframe.props.identifier.indexOf('superset')!== -1))
            return true
        else
            return false
    }

    isMetabase(){
        const { iframe } = this.props
        if ((iframe.identifier && iframe.identifier.indexOf('metabase')!== -1) || (iframe.props && iframe.props.identifier.indexOf('metabase')!== -1))
            return true
        else
            return false
    }

    //remove &standalone=true from original link
    getLink(url){
        if(url)
            if(url.indexOf('&standalone=true') !== -1){
                url = url.substring(0, url.length - 16);
            }
        return url
    }

    linkTo(nome){
        this.props.history.push('/private/dataset/'+nome)
    }

    onImgError = ()=>{
        if(!this.state.onError)
            this.setState({
                url: serviceurl.urlCacher + 'image404.png',
                onError: true
            })
    }

    render(){
        const { iframe, className, cardClassName, onClick } = this.props
        const { url } = this.state
        var org = ''
        var sp1 = []
        var table
        if(iframe.table){
            if(this.isMetabase()){
              table = iframe.table
            }
            else if(this.isSuperset() && iframe.table.indexOf('_o_')!==-1){
                sp1 = iframe.table.split('_o_')
                let sp2 = sp1[0].split('.')
                org = sp2[1]
                table = sp1[1]
                if(iframe.table.indexOf('opendata__')!==-1){
                  table = org + '_o_'+sp1[1]
                }
            }
        }

        var open
        if(iframe.iframe_url && iframe.iframe_url.indexOf(serviceurl.urlSuperset)>-1){
            open = false
        }else if(iframe.iframe_url && (iframe.iframe_url.indexOf(serviceurl.urlSupersetOpen)>-1)){
            open = true
        }
        if(iframe.iframe_url) {
            if(iframe.iframe_url.indexOf(serviceurl.urlSuperset)>-1){
                open = false
            }else if(iframe.iframe_url.indexOf(serviceurl.urlSupersetOpen)>-1){
                open = true
            }
        }else if(iframe.props && iframe.props.url){
            if(iframe.props.url.indexOf(serviceurl.urlSuperset)>-1){
                open = false
            }else if(iframe.props.url.indexOf(serviceurl.urlSupersetOpen)>-1){
                open = true
            }
        }else if(iframe.widget_url){
            if(iframe.widget_url.indexOf(serviceurl.urlSuperset)>-1){
                open = false
            }else if(iframe.widget_url.indexOf(serviceurl.urlSupersetOpen)>-1){
                open = true
            }
        }

        var iframeUrl = ''

        if(iframe.iframe_url) {
            iframeUrl = iframe.iframe_url
        }else if(iframe.props && iframe.props.url){
            iframeUrl = iframe.props.url
        }else if(iframe.widget_url){
            iframeUrl = iframe.widget_url
        }
        return(
            <div className={"mx-auto "+className}>
                <div className={"card widget-card "+cardClassName}>
                    <div className="header-widget py-1">
                        <div className="row my-1 mx-0">
                            <div className="col-9 title-widget my-1 pl-3">
                                <a href={this.getLink(iframeUrl)} target='_blank' rel="noopener noreferrer" title={iframe.title}><p className="text-primary"><u>{truncateWidgetTitle(iframe.title)}</u></p></a>
                            </div>
                            <div className="col-3 my-2">
                                {!open?
                                    <span className="pointer" title='Il widget è privato'><i className="fas fa-lock fa-pull-right text-icon pointer" style={{fontSize: '16px'}}/></span>
                                :
                                    <span className="pointer" title='Il widget è pubblico'><i className="fas fa-globe fa-pull-right text-icon pointer" style={{ fontSize: '16px' }}/></span>
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row m-0 b-b-card">
                            <div className="crop col-12 w-100">
                                {onClick ? <div className="img_hover_container pointer" onClick={onClick} title="Aggiungi questo widget">
                                                <img src={url} alt={iframe.table?transformWidgetName(iframe.table):''} className="hover_image" onError={this.onImgError}/>
                                                <div className="middle">
                                                    {/*<div className="text">+</div>*/}
                                                    <i className="fas fa-3x fa-plus text-secondary"/>
                                                </div>
                                                {/* React.createElement(IframeWidget, { url: iframe.iframe_url, class: "no-click" }) */}
                                            </div>
                                :
                                    <div>
                                        <img src={url} alt={iframe.table?transformWidgetName(iframe.table):''} onError={this.onImgError}/>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 footer-widget">
                        <div className="col-2 p-0 h-100">
                            <div className="tool text-icon text-center bg-light b-b-card b-r-dash d-flex align-items-center pointer justify-content-center">
                                {this.isSuperset() && <i className="fa fa-database" title="Realizzato con Superset"/>}
                                {this.isMetabase() && <i className="fa fa-chart-pie" title="Realizzato con Metabase" />}
                            </div>
                        </div>
                        <div className="col-8 h-100 d-flex align-items-center">
                            <div className="mr-2" title={table ? (table) : ''}>
                                <i className="text-icon fa fa-table" />
                            </div>
                            {table ? transformDatasetName(table):''}
                        </div>
                        {sp1 && <div className="col-2 h-100 d-flex align-items-center">
                            <Link to={'/private/dataset/'+table}>
                                <div className="text-primary">
                                    <i className="fa fa-arrow-circle-right fa-pull-right fa-lg" title="Vai al Dataset"/>
                                </div>
                            </Link>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

export default WidgetCard

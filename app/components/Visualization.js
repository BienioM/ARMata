// @flow
import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import { remote } from 'electron';
import styles from './Visualization.css'; // eslint-disable-line flowtype-errors/show-errors

export default class Visualization extends Component {
  props: {
    json: Object,
    hierarchicalLayout: boolean
  }

  resources: any;

  static findImage(resourceType: string) {
    let dir = '';
    if (process.env.NODE_ENV === 'development') {
      dir = '../assets/azure/';
    } else {
      dir = `${remote.app.getAppPath()}../../assets/azure/`;
    }

    switch (resourceType) {
      case 'Microsoft.Web/serverfarms':
        return `${dir}Azure App Service_COLOR.png`;
      case 'Microsoft.Web/sites':
        return `${dir}Azure App Service - Web App_COLOR.png`;
      case 'Microsoft.Insights/components':
        return `${dir}Azure Application Insights_COLOR.png`;
      case 'Microsoft.Storage/storageAccounts':
        return `${dir}Azure Storage.png`;
      case 'Microsoft.EventHub/namespaces':
        return `${dir}Azure Event Hubs_COLOR.png`;
      case 'Microsoft.Network/trafficManagerProfiles':
        return `${dir}Azure Traffic Manager_COLOR.png`;
      case 'Microsoft.Network/trafficManagerProfiles/azureEndpoints':
        return `${dir}Azure Traffic Manager.png`;
      case 'Microsoft.NotificationHubs/namespaces':
        return `${dir}Azure Notification Hubs_COLOR.png`;
      case 'Microsoft.Resources/deployments':
        return `${dir}Unidentified feature object_COLOR.png`;
      case 'Microsoft.Network/networkInterfaces':
        return `${dir}Azure Virtual Network.png`;
      case 'Microsoft.Network/virtualNetworks':
        return `${dir}Azure Virtual Network_COLOR.png`;
      case 'Microsoft.Network/publicIpAddresses':
        return `${dir}Azure Virtual Network.png`;
      case 'Microsoft.Network/networkSecurityGroups':
        return `${dir}Azure Virtual Network.png`;
      case 'Microsoft.Compute/virtualMachines':
        return `${dir}Azure Virtual Machine_COLOR.png`;
      case 'Microsoft.Network/applicationGateways':
        return `${dir}Azure Application Gateway_COLOR.png`;
      default:
        return `${dir}Unidentified feature object_COLOR.png`;
    }
  }

  render() {
    this.resources = this.props.json.resources;

    const resources = [];
    const dependencies = [];
    for (let i = 0; i < this.resources.length; i += 1) {
      const resource = this.resources[i];
      const id = `${resource.displayName}`;

      const dependsOn = resource.dependsOn || [];
      for (let y = 0; y < dependsOn.length; y += 1) {
        dependencies.push({
          from: id,
          to: resource.dependsOn[y].name
        });
      }

      resources.push({
        id,
        label: resource.displayName,
        shape: 'image',
        image: Visualization.findImage(this.resources[i].type)
      });
    }

    const graph = {
      nodes: resources,
      edges: dependencies
    };

    const options = {
      nodes: {
        borderWidth: 4,
        size: 30,
        color: {
          border: '#222222',
          background: '#666666'
        },
        font: {
          color: '#fff'
        }
      },
      layout: {
        hierarchical: this.props.hierarchicalLayout
      },
      edges: {
        color: '#FFFFFF'
      },
      autoResize: true
    };

    return (<div className={styles.visualization}><Graph graph={graph} options={options} style={{ width: '100%', height: '100%' }} /></div>);
  }
}

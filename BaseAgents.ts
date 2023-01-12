import type { InitConfig } from '@aries-framework/core'

import { Agent, AutoAcceptCredential, AutoAcceptProof, HttpOutboundTransport } from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'

const bcovrin = //hardcoded genesis to Bcovrin Test Network

export class BaseAgent {
  public port: number
  public name: string
  public config: InitConfig
  public agent: Agent

  public constructor(port: number, name: string) {
    this.name = name
    this.port = port

    const config: InitConfig = {
      label: name,
      walletConfig: {
        id: name,
        key: name,
      },
      publicDidSeed: 'test0000000000000000000000000000',
      indyLedgers: [
        {
          genesisTransactions: bcovrin,
          id: 'testt' + name,
          indyNamespace: 'testt' + name,
          isProduction: false,
        },
      ],
      endpoints: [`http://localhost:${this.port}`],
      autoAcceptConnections: true,
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
    }

    this.config = config

    this.agent = new Agent({ config, dependencies: agentDependencies })
    this.agent.registerInboundTransport(new HttpInboundTransport({ port }))
    this.agent.registerOutboundTransport(new HttpOutboundTransport())
  }

  public async initializeAgent() {
    await this.agent.initialize()
  }
}
import demoNamespace from './demo.namespace'
import systemNamespace from './system.namespace'
import walletNamespace from './wallet.namespace'
import crashGameNamespace from './crashGame.namespace'
import chatNamespace from './chat.namespace'
import engine3Namespace from './engine3.namespace'

export default function (io) {
  crashGameNamespace(io)
  demoNamespace(io)
  walletNamespace(io)
  systemNamespace(io)
  chatNamespace(io)
  engine3Namespace(io)
}

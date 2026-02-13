// Demo data for Pods Resource Usage table (OpenShift Lightspeed–style)

const podNames = [
  "prometheus-k8s-1",
  "ovnkube-node-qzhgn",
  "thanos-querier-7dbd9f4648-cpqzq",
  "grafana-7d4f8b9c5-xk2mn",
  "alertmanager-main-0",
  "openshift-console-5d7b8c9f-x7mnp",
  "oauth-server-6f8a2b1c-9kltp",
  "etcd-operator-4c5d6e7f-2jnqr",
  "kube-apiserver-master-0",
  "coredns-5f8b9c0d-3xwpl",
  "router-default-6g7h8i9j-4mnop",
  "cluster-monitoring-operator-5k6l7m8n",
  "node-exporter-9p0q1r2s-5tuvw",
  "kube-state-metrics-1a2b3c4d-6xyza",
  "telemeter-client-7e8f9g0h-1bcde",
];

const namespaces = [
  "openshift-monitoring",
  "openshift-ovn-kubernetes",
  "openshift-user-workload-monitoring",
  "openshift-monitoring",
  "openshift-monitoring",
  "openshift-console",
  "openshift-authentication",
  "openshift-etcd",
  "openshift-kube-apiserver",
  "openshift-dns",
  "openshift-ingress",
  "openshift-monitoring",
  "openshift-monitoring",
  "openshift-monitoring",
  "openshift-monitoring",
  "openshift-monitoring",
];

const cpuMillicores = [44, 25, 18, 15, 13, 9, 8, 6, 12, 5, 7, 11, 4, 3, 10, 2];

const memoryMi = [
  853, 833, 323, 315, 130, 140, 142, 111, 109, 141, 72, 38, 95, 88, 156, 64,
];

export const podsResourceTableConfig = {
  component: "data-view" as const,
  id: "pods-resource-usage",
  inputDataType: "pods-resource",
  title: "Pods Resource Usage",
  perPage: 10,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
  fields: [
    {
      id: "pod",
      name: "Pod",
      data_path: "pod.name",
      data: podNames,
    },
    {
      id: "namespace",
      name: "Namespace",
      data_path: "pod.namespace",
      data: namespaces,
    },
    {
      id: "cpu",
      name: "CPU",
      data_path: "pod.cpu",
      data: cpuMillicores,
    },
    {
      id: "memory",
      name: "Memory",
      data_path: "pod.memory",
      data: memoryMi,
    },
  ],
};

export const POD_COUNT = podNames.length;

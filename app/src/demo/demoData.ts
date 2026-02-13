// Demo data used by the app pages to render components from the monorepo

export const imageDemo = {
  component: "image" as const,
  id: "demo-image-1",
  image: "https://www.patternfly.org/images/f18506f4.svg",
  title: "PatternFly Logo (demo)",
};

export const imageDemoLarge = {
  component: "image" as const,
  id: "demo-image-2",
  image: "https://picsum.photos/800/600",
  title: "Random Image (Large)",
};

export const oneCardDemo = {
  title: "Server Details",
  id: "onecard-1",
  image: "https://avatars.githubusercontent.com/u/6391110?v=4",
  imageSize: "md",
  fields: [
    { name: "Hostname", data_path: "host.name", data: ["server-01"] },
    { name: "IP", data_path: "host.ip", data: ["10.0.0.5"] },
    { name: "Uptime", data_path: "host.uptime", data: ["72 days"] },
  ],
};

export const oneCardDemoNoImage = {
  title: "Database Configuration",
  id: "onecard-2",
  fields: [
    { name: "Database", data_path: "db.name", data: ["PostgreSQL"] },
    { name: "Version", data_path: "db.version", data: ["15.2"] },
    { name: "Port", data_path: "db.port", data: [5432] },
    { name: "Max Connections", data_path: "db.max_conn", data: [100] },
  ],
};

export const oneCardDemoSmallImage = {
  title: "User Profile",
  id: "onecard-3",
  image: "https://avatars.githubusercontent.com/u/6391110?v=4",
  imageSize: "sm",
  fields: [
    { name: "Username", data_path: "user.name", data: ["admin"] },
    { name: "Role", data_path: "user.role", data: ["Administrator"] },
  ],
};

export const setOfCardsDemo = {
  component: "set-of-cards" as const,
  id: "setof-1",
  title: "Disks",
  fields: [
    { name: "Device", data_path: "disk.device", data: ["sda", "sdb", "sdc"] },
    { name: "Size", data_path: "disk.size", data: ["100GB", "200GB", "500GB"] },
    { name: "Mount", data_path: "disk.mount", data: ["/", "/data", "/backup"] },
  ],
};

export const setOfCardsDemoTwoCards = {
  component: "set-of-cards" as const,
  id: "setof-2",
  title: "Network Interfaces",
  fields: [
    {
      name: "Interface",
      data_path: "network.interface",
      data: ["eth0", "eth1"],
    },
    {
      name: "IP Address",
      data_path: "network.ip",
      data: ["192.168.1.100", "10.0.0.50"],
    },
    { name: "Status", data_path: "network.status", data: ["up", "down"] },
    {
      name: "Speed",
      data_path: "network.speed",
      data: ["1000 Mbps", "1000 Mbps"],
    },
  ],
};

export const tableDemo = {
  component: "data-view" as const,
  id: "table-1",
  title: "Users",
  fields: [
    { name: "Name", data_path: "user.name", data: ["Alice", "Bob", "Carol"] },
    {
      name: "Email",
      data_path: "user.email",
      data: ["alice@example.com", "bob@example.com", "carol@example.com"],
    },
    { name: "Active", data_path: "user.active", data: [true, false, true] },
  ],
};

export const tableDemoComplexData = {
  component: "data-view" as const,
  id: "table-2",
  title: "System Metrics",
  fields: [
    {
      name: "Service",
      data_path: "service.name",
      data: ["API", "Database", "Cache", "Queue"],
    },
    { name: "CPU %", data_path: "service.cpu", data: [45.2, 78.9, 12.3, 34.1] },
    {
      name: "Memory (GB)",
      data_path: "service.memory",
      data: [2.5, 8.3, 0.5, 1.2],
    },
    {
      name: "Healthy",
      data_path: "service.healthy",
      data: [true, false, true, true],
    },
    {
      name: "Tags",
      data_path: "service.tags",
      data: [
        ["production", "critical"],
        ["production"],
        ["staging"],
        ["production", "worker"],
      ],
    },
  ],
};

export const videoDemo = {
  id: "video-1",
  title: "YouTube Video with Poster",
  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  video_img: "https://avatars.githubusercontent.com/u/6391110?v=4",
  autoPlay: false,
  controls: true,
  aspectRatio: "16:9" as const,
};

export const videoDemoAuto = {
  id: "video-2",
  title: "Direct Video (Auto Aspect Ratio)",
  video: "https://www.w3schools.com/html/mov_bbb.mp4",
  autoPlay: true,
  controls: true,
  aspectRatio: "auto" as const,
};

export const videoDemo4x3 = {
  id: "video-3",
  title: "Classic 4:3 Format",
  video: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  autoPlay: false,
  controls: true,
  aspectRatio: "4:3" as const,
};

export const dynamicDemo = {
  component: "one-card" as const,
  key: "onecard-demo",
  props: oneCardDemo,
};

export const dynamicDemoImage = {
  component: "image" as const,
  key: "image-demo",
  props: imageDemo,
};

export const dynamicDemoTable = {
  component: "data-view" as const,
  key: "table-demo",
  props: tableDemo,
};

// Chart component demos
export const chartDemoBar = {
  component: "chart-bar" as const,
  id: "chart-bar-demo",
  title: "Quarterly Revenue by Product",
  data: [
    {
      name: "Product A",
      data: [
        { x: "Q1", y: 30 },
        { x: "Q2", y: 45 },
        { x: "Q3", y: 60 },
        { x: "Q4", y: 55 },
      ],
    },
    {
      name: "Product B",
      data: [
        { x: "Q1", y: 25 },
        { x: "Q2", y: 35 },
        { x: "Q3", y: 40 },
        { x: "Q4", y: 50 },
      ],
    },
    {
      name: "Product C",
      data: [
        { x: "Q1", y: 20 },
        { x: "Q2", y: 30 },
        { x: "Q3", y: 35 },
        { x: "Q4", y: 45 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoLine = {
  component: "chart-line" as const,
  id: "chart-line-demo",
  title: "Website Traffic Over Time",
  data: [
    {
      name: "Desktop",
      data: [
        { x: "Jan", y: 1200 },
        { x: "Feb", y: 1500 },
        { x: "Mar", y: 1800 },
        { x: "Apr", y: 2100 },
        { x: "May", y: 2400 },
        { x: "Jun", y: 2700 },
      ],
    },
    {
      name: "Mobile",
      data: [
        { x: "Jan", y: 800 },
        { x: "Feb", y: 1100 },
        { x: "Mar", y: 1400 },
        { x: "Apr", y: 1700 },
        { x: "May", y: 2000 },
        { x: "Jun", y: 2300 },
      ],
    },
    {
      name: "Tablet",
      data: [
        { x: "Jan", y: 400 },
        { x: "Feb", y: 500 },
        { x: "Mar", y: 600 },
        { x: "Apr", y: 700 },
        { x: "May", y: 800 },
        { x: "Jun", y: 900 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoPie = {
  component: "chart-pie" as const,
  id: "chart-pie-demo",
  title: "Market Share by Browser",
  data: [
    {
      name: "Browsers",
      data: [
        { name: "Chrome", x: "Chrome", y: 65 },
        { name: "Safari", x: "Safari", y: 19 },
        { name: "Firefox", x: "Firefox", y: 9 },
        { name: "Edge", x: "Edge", y: 5 },
        { name: "Other", x: "Other", y: 2 },
      ],
    },
  ],
  themeColor: "blue" as const,
};

export const chartDemoDonut = {
  component: "chart-donut" as const,
  id: "chart-donut-demo",
  title: "Storage Usage",
  data: [
    {
      name: "Storage",
      data: [
        { name: "Documents", x: "Documents", y: 45 },
        { name: "Photos", x: "Photos", y: 30 },
        { name: "Videos", x: "Videos", y: 15 },
        { name: "Music", x: "Music", y: 8 },
        { name: "Other", x: "Other", y: 2 },
      ],
    },
  ],
  themeColor: "multi" as const,
  donutSubTitle: "GB Used",
};

// Chart demo with large numbers
export const chartDemoBarLargeNumbers = {
  component: "chart-bar" as const,
  id: "chart-bar-large-demo",
  title: "Annual Revenue by Region (in USD)",
  data: [
    {
      name: "North America",
      data: [
        { x: 2020, y: 125000000 },
        { x: 2021, y: 145000000 },
        { x: 2022, y: 178000000 },
        { x: 2023, y: 205000000 },
        { x: 2024, y: 240000000 },
      ],
    },
    {
      name: "Europe",
      data: [
        { x: 2020, y: 98000000 },
        { x: 2021, y: 112000000 },
        { x: 2022, y: 135000000 },
        { x: 2023, y: 158000000 },
        { x: 2024, y: 185000000 },
      ],
    },
    {
      name: "Asia Pacific",
      data: [
        { x: 2020, y: 87000000 },
        { x: 2021, y: 105000000 },
        { x: 2022, y: 142000000 },
        { x: 2023, y: 189000000 },
        { x: 2024, y: 256000000 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoLineLargeNumbers = {
  component: "chart-line" as const,
  id: "chart-line-large-demo",
  title: "Global User Growth (Total Active Users)",
  data: [
    {
      name: "Platform A",
      data: [
        { x: 2018, y: 850000000 },
        { x: 2019, y: 1200000000 },
        { x: 2020, y: 1750000000 },
        { x: 2021, y: 2300000000 },
        { x: 2022, y: 2850000000 },
        { x: 2023, y: 3400000000 },
      ],
    },
    {
      name: "Platform B",
      data: [
        { x: 2018, y: 450000000 },
        { x: 2019, y: 675000000 },
        { x: 2020, y: 925000000 },
        { x: 2021, y: 1250000000 },
        { x: 2022, y: 1620000000 },
        { x: 2023, y: 2100000000 },
      ],
    },
    {
      name: "Platform C",
      data: [
        { x: 2018, y: 125000000 },
        { x: 2019, y: 280000000 },
        { x: 2020, y: 525000000 },
        { x: 2021, y: 890000000 },
        { x: 2022, y: 1350000000 },
        { x: 2023, y: 1900000000 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoBarScaled = {
  component: "chart-bar" as const,
  id: "chart-bar-scaled-demo",
  title: "Quarterly Revenue (Scaled to 70%)",
  data: [
    {
      name: "Product A",
      data: [
        { x: "Q1", y: 30 },
        { x: "Q2", y: 45 },
        { x: "Q3", y: 60 },
        { x: "Q4", y: 55 },
      ],
    },
    {
      name: "Product B",
      data: [
        { x: "Q1", y: 25 },
        { x: "Q2", y: 35 },
        { x: "Q3", y: 40 },
        { x: "Q4", y: 50 },
      ],
    },
  ],
  width: 600,
  height: 400,
  themeColor: "blue" as const,
  scale: 0.7,
};

// Additional DynamicComponent examples
export const setOfCardsDemoWithImages = {
  component: "set-of-cards" as const,
  id: "setof-3",
  title: "Team Members",
  fields: [
    {
      name: "Name",
      data_path: "team.name",
      data: ["Alice Johnson", "Bob Smith", "Carol Williams", "David Brown"],
    },
    {
      name: "Role",
      data_path: "team.role",
      data: [
        "Lead Developer",
        "DevOps Engineer",
        "UI/UX Designer",
        "Product Manager",
      ],
    },
    {
      name: "Email",
      data_path: "team.email",
      data: [
        "alice@company.com",
        "bob@company.com",
        "carol@company.com",
        "david@company.com",
      ],
    },
    {
      name: "Years",
      data_path: "team.years",
      data: [5, 3, 4, 7],
    },
  ],
  images: [oneCardDemo.image, null, oneCardDemo.image, oneCardDemo.image],
};

export const tableDemoServerMetrics = {
  component: "data-view" as const,
  id: "table-3",
  title: "Server Performance Metrics",
  fields: [
    {
      name: "Server",
      data_path: "server.name",
      data: ["web-01", "web-02", "db-01", "cache-01", "queue-01"],
    },
    {
      name: "CPU Usage",
      data_path: "server.cpu",
      data: ["45%", "67%", "89%", "23%", "34%"],
    },
    {
      name: "Memory Usage",
      data_path: "server.memory",
      data: ["3.2 GB", "5.8 GB", "12.4 GB", "1.5 GB", "2.1 GB"],
    },
    {
      name: "Disk I/O",
      data_path: "server.disk_io",
      data: ["120 MB/s", "85 MB/s", "450 MB/s", "35 MB/s", "78 MB/s"],
    },
    {
      name: "Status",
      data_path: "server.status",
      data: ["healthy", "healthy", "warning", "healthy", "healthy"],
    },
  ],
};

export const oneCardDemoAPIEndpoint = {
  component: "one-card" as const,
  title: "API Endpoint Status",
  id: "onecard-4",
  fields: [
    { name: "Endpoint", data_path: "api.endpoint", data: ["/api/v1/users"] },
    { name: "Method", data_path: "api.method", data: ["GET"] },
    { name: "Response Time", data_path: "api.response_time", data: ["125ms"] },
    { name: "Success Rate", data_path: "api.success_rate", data: ["99.8%"] },
    { name: "Requests/min", data_path: "api.requests", data: [1250] },
  ],
};

export const oneCardDemoWithDates = {
  component: "one-card" as const,
  title: "Project Details",
  id: "onecard-5",
  image: "https://avatars.githubusercontent.com/u/6391110?v=4",
  imageSize: "md",
  fields: [
    { name: "Project Name", data_path: "project.name", data: ["Next Gen UI"] },
    { name: "Status", data_path: "project.status", data: ["Active"] },
    {
      name: "Created",
      data_path: "project.created",
      data: ["2024-01-15"],
    },
    {
      name: "Last Updated",
      data_path: "project.updated",
      data: ["2024-12-20T14:30:00Z"],
    },
    {
      name: "Release Date",
      data_path: "project.release",
      data: ["2025-03-01T09:00:00Z"],
    },
    { name: "Version", data_path: "project.version", data: ["2.1.0"] },
  ],
};

export const chartDemoBarStacked = {
  component: "chart-bar" as const,
  id: "chart-bar-stacked-demo",
  title: "Monthly Sales by Category",
  data: [
    {
      name: "Electronics",
      data: [
        { x: "Jan", y: 45000 },
        { x: "Feb", y: 52000 },
        { x: "Mar", y: 48000 },
        { x: "Apr", y: 61000 },
        { x: "May", y: 58000 },
        { x: "Jun", y: 67000 },
      ],
    },
    {
      name: "Clothing",
      data: [
        { x: "Jan", y: 28000 },
        { x: "Feb", y: 31000 },
        { x: "Mar", y: 35000 },
        { x: "Apr", y: 29000 },
        { x: "May", y: 42000 },
        { x: "Jun", y: 38000 },
      ],
    },
    {
      name: "Home & Garden",
      data: [
        { x: "Jan", y: 18000 },
        { x: "Feb", y: 22000 },
        { x: "Mar", y: 25000 },
        { x: "Apr", y: 28000 },
        { x: "May", y: 31000 },
        { x: "Jun", y: 35000 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

export const chartDemoLinePerformance = {
  component: "chart-line" as const,
  id: "chart-line-performance-demo",
  title: "Application Performance (Response Time)",
  data: [
    {
      name: "API Server",
      data: [
        { x: "00:00", y: 125 },
        { x: "04:00", y: 98 },
        { x: "08:00", y: 245 },
        { x: "12:00", y: 389 },
        { x: "16:00", y: 278 },
        { x: "20:00", y: 156 },
      ],
    },
    {
      name: "Database",
      data: [
        { x: "00:00", y: 45 },
        { x: "04:00", y: 38 },
        { x: "08:00", y: 112 },
        { x: "12:00", y: 198 },
        { x: "16:00", y: 145 },
        { x: "20:00", y: 67 },
      ],
    },
  ],
  themeColor: "green" as const,
};

export const chartDemoPieServerDistribution = {
  component: "chart-pie" as const,
  id: "chart-pie-server-demo",
  title: "Server Distribution by Region",
  data: [
    {
      name: "Regions",
      data: [
        { name: "US East", x: "US East", y: 45 },
        { name: "US West", x: "US West", y: 30 },
        { name: "EU Central", x: "EU Central", y: 15 },
        { name: "Asia Pacific", x: "Asia Pacific", y: 10 },
      ],
    },
  ],
  themeColor: "purple" as const,
};

export const chartDemoDonutCostBreakdown = {
  component: "chart-donut" as const,
  id: "chart-donut-cost-demo",
  title: "Monthly Cloud Cost Breakdown",
  data: [
    {
      name: "Cost",
      data: [
        { name: "Compute", x: "Compute", y: 12500 },
        { name: "Storage", x: "Storage", y: 4800 },
        { name: "Networking", x: "Networking", y: 2100 },
        { name: "Database", x: "Database", y: 8900 },
        { name: "Other", x: "Other", y: 1700 },
      ],
    },
  ],
  themeColor: "orange" as const,
  donutSubTitle: "USD",
};

export const chartDemoBarMoviesHorizontal = {
  component: "chart-bar" as const,
  id: "chart-bar-movies-horizontal-demo",
  title: "Box Office Revenue by Movie (Horizontal)",
  data: [
    {
      name: "Domestic Revenue (USD)",
      data: [
        { x: "Toy Story (1995)", y: 373554033 },
        { x: "The Shawshank Redemption (1994)", y: 29140617 },
        { x: "The Dark Knight (2008)", y: 533316061 },
        { x: "Inception (2010)", y: 292576195 },
        { x: "The Matrix (1999)", y: 171479930 },
        { x: "Interstellar (2014)", y: 188341469 },
      ],
    },
  ],
  themeColor: "blue" as const,
  horizontal: true,
  yAxisLabelAngle: 0,
};

export const chartDemoBarSubscriptionRuntimes = {
  component: "chart-bar" as const,
  id: "chart-bar-subscription-runtimes",
  title: "Subscription Runtimes",
  x_axis_label: "Subscription",
  data: [
    {
      name: "Number of Runtimes",
      data: [
        { name: null, x: "RHEL", y: 2 },
        { name: null, x: "Red Hat Developer", y: 4 },
        { name: null, x: "EAP", y: 3 },
        { name: null, x: "ACVR", y: 5 },
        { name: null, x: "Red Hat SSS subscription", y: 1 },
        { name: null, x: "OLP", y: 2 },
        { name: null, x: "JSR subscription", y: 2 },
        { name: null, x: "MMM", y: 3 },
        { name: null, x: "KOLER subscription", y: 2 },
        { name: null, x: "FEL subscription", y: 4 },
        { name: null, x: "OLPIC subscription", y: 2 },
        { name: null, x: "SAE subscription", y: 3 },
        { name: null, x: "MEKOL subscription", y: 2 },
        { name: null, x: "Red Hat ORUL subscription", y: 2 },
        { name: null, x: "YOLO subscription", y: 325 },
      ],
    },
  ],
  themeColor: "blue" as const,
};

export const imageLogoGrid = {
  component: "image" as const,
  id: "demo-image-logos",
  image:
    "https://www.redhat.com/cms/managed-files/Logo-Red_Hat-A-Reverse-RGB.svg",
  title: "Red Hat Logo",
};

export const tableDemoEmpty = {
  component: "data-view" as const,
  id: "table-empty",
  title: "No Data Available",
  fields: [
    { name: "Column 1", data_path: "data.col1", data: [] },
    { name: "Column 2", data_path: "data.col2", data: [] },
  ],
};

// Mirrored Bar Chart Example (Simplified API)
export const chartMovieROISimple = {
  component: "chart-mirrored-bar" as const,
  id: "chart-movie-roi-simple",
  title: "Movie ROI vs Budget Comparison",
  data: [
    {
      name: "ROI",
      data: [
        { x: "Toy Story", y: 11.45 },
        { x: "Shawshank Redemption", y: 1.35 },
        { x: "The Dark Knight", y: 4.43 },
        { x: "Inception", y: 4.23 },
        { x: "The Matrix", y: 6.36 },
        { x: "Interstellar", y: 3.11 },
      ],
    },
    {
      name: "Budget",
      data: [
        { x: "Toy Story", y: 30000000 },
        { x: "Shawshank Redemption", y: 25000000 },
        { x: "The Dark Knight", y: 185000000 },
        { x: "Inception", y: 160000000 },
        { x: "The Matrix", y: 63000000 },
        { x: "Interstellar", y: 165000000 },
      ],
    },
  ],
  themeColor: "multi" as const,
};

// Mirrored Chart Examples
// Top chart for ROI (positive values)
export const chartMovieROI = {
  component: "chart-bar" as const,
  id: "chart-movie-roi",
  title: "Return on Investment (ROI Multiplier)",
  data: [
    {
      name: "ROI",
      data: [
        { x: "Toy Story", y: 11.45 },
        { x: "Shawshank Redemption", y: 1.35 },
        { x: "The Dark Knight", y: 4.43 },
        { x: "Inception", y: 4.23 },
        { x: "The Matrix", y: 6.36 },
        { x: "Interstellar", y: 3.11 },
      ],
    },
  ],
  themeColor: "green" as const,
};

// Bottom chart for Budget (negative values with absolute display)
export const chartMovieBudget = {
  component: "chart-bar" as const,
  id: "chart-movie-budget",
  title: "Production Budget (USD)",
  data: [
    {
      name: "Budget",
      data: [
        { x: "Toy Story", y: -30000000 },
        { x: "Shawshank Redemption", y: -25000000 },
        { x: "The Dark Knight", y: -185000000 },
        { x: "Inception", y: -160000000 },
        { x: "The Matrix", y: -63000000 },
        { x: "Interstellar", y: -165000000 },
      ],
    },
  ],
  themeColor: "blue" as const,
  showAbsoluteValues: true,
};

// Empty State demos
export const emptyStateInfo = {
  component: "empty-state" as const,
  id: "empty-state-info",
  title: "No Data Available",
  content: "We couldn't find any data to display at this time.",
  variant: "info" as const,
};

export const emptyStateSuccess = {
  component: "empty-state" as const,
  id: "empty-state-success",
  title: "All Tasks Complete",
  content: "Great job! You've completed all your tasks successfully.",
  variant: "success" as const,
};

export const emptyStateWarning = {
  component: "empty-state" as const,
  id: "empty-state-warning",
  title: "Action Required",
  content: "Some configurations need your attention before you can proceed.",
  variant: "warning" as const,
};

export const emptyStateError = {
  component: "empty-state" as const,
  id: "empty-state-error",
  title: "Connection Failed",
  content: "Unable to connect to the server. Please try again later.",
  variant: "error" as const,
};

export const emptyStateCustomIcon = {
  component: "empty-state" as const,
  id: "empty-state-custom",
  title: "Custom Icon Example",
  content: "This demonstrates a custom icon configuration.",
  variant: "info" as const,
  icon: "CheckCircleIcon",
};

// DataView demos
export const dataViewServers = {
  component: "data-view" as const,
  id: "dataview-servers",
  fields: [
    {
      id: "server-name",
      name: "Server Name",
      data_path: "servers.name",
      data: [
        "prod-web-01",
        "prod-web-02",
        "prod-db-01",
        "staging-web-01",
        "dev-web-01",
      ],
    },
    {
      id: "ip-address",
      name: "IP Address",
      data_path: "servers.ip",
      data: [
        "192.168.1.10",
        "192.168.1.11",
        "192.168.1.20",
        "192.168.2.10",
        "192.168.3.10",
      ],
    },
    {
      id: "environment",
      name: "Environment",
      data_path: "servers.env",
      data: [
        "Production",
        "Production",
        "Production",
        "Staging",
        "Development",
      ],
    },
    {
      id: "cpu-usage",
      name: "CPU Usage",
      data_path: "servers.cpu",
      data: ["45%", "67%", "23%", "12%", "8%"],
    },
    {
      id: "memory",
      name: "Memory",
      data_path: "servers.memory",
      data: [
        "8GB / 16GB",
        "12GB / 16GB",
        "4GB / 32GB",
        "2GB / 8GB",
        "1GB / 8GB",
      ],
    },
    {
      id: "status",
      name: "Status",
      data_path: "servers.status",
      data: ["Running", "Running", "Running", "Running", "Stopped"],
    },
  ],
  perPage: 10,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
};

// DataView with minimal configuration to test defaults (12 items - pagination enabled)
export const dataViewMinimal = {
  component: "data-view" as const,
  id: "dataview-minimal",
  fields: [
    {
      id: "item",
      name: "Item",
      data_path: "items.name",
      data: [
        "Item A",
        "Item B",
        "Item C",
        "Item D",
        "Item E",
        "Item F",
        "Item G",
        "Item H",
        "Item I",
        "Item J",
        "Item K",
        "Item L",
      ],
    },
    {
      id: "category",
      name: "Category",
      data_path: "items.category",
      data: [
        "Electronics",
        "Books",
        "Clothing",
        "Food",
        "Sports",
        "Home",
        "Garden",
        "Toys",
        "Music",
        "Health",
        "Beauty",
        "Tools",
      ],
    },
    {
      id: "quantity",
      name: "Quantity",
      data_path: "items.quantity",
      data: [10, 25, 8, 50, 15, 32, 18, 45, 7, 22, 38, 12],
    },
  ],
  // No optional props - should use all defaults:
  // perPage: 5, enableFilters: auto (true for >5 items), enablePagination: auto (true for >5 items), enableSort: true
};

// DataView with minimal configuration and 5 items (filters & pagination auto-disabled)
export const dataViewMinimalSmall = {
  component: "data-view" as const,
  id: "dataview-minimal-small",
  fields: [
    {
      id: "task",
      name: "Task",
      data_path: "tasks.name",
      data: [
        "Setup Development Environment",
        "Write Unit Tests",
        "Code Review",
        "Deploy to Staging",
        "Update Documentation",
      ],
    },
    {
      id: "status",
      name: "Status",
      data_path: "tasks.status",
      data: ["Complete", "In Progress", "Pending", "Complete", "In Progress"],
    },
    {
      id: "priority",
      name: "Priority",
      data_path: "tasks.priority",
      data: ["High", "Medium", "Low", "Medium", "Low"],
    },
  ],
  // No optional props - should use all defaults:
  // perPage: 5, enableFilters: auto (false for ≤5 items), enablePagination: auto (false for ≤5 items), enableSort: true
};

// DataView demonstrating numeric sorting
export const dataViewNumericSort = {
  component: "data-view" as const,
  id: "dataview-numeric-sort",
  fields: [
    {
      id: "id",
      name: "ID",
      data_path: "items.id",
      data: [1, 2, 10, 20, 100, 5, 50, 3, 30, 7],
    },
    {
      id: "size",
      name: "Size",
      data_path: "items.size",
      data: [
        "1GB",
        "2GB",
        "10GB",
        "20GB",
        "100GB",
        "5GB",
        "50GB",
        "3GB",
        "30GB",
        "7GB",
      ],
    },
    {
      id: "price",
      name: "Price",
      data_path: "items.price",
      data: [
        "$1.50",
        "$2.00",
        "$10.99",
        "$20.50",
        "$100.00",
        "$5.25",
        "$50.75",
        "$3.99",
        "$30.00",
        "$7.49",
      ],
    },
    {
      id: "count",
      name: "Count",
      data_path: "items.count",
      data: [
        "1 item",
        "2 items",
        "10 items",
        "20 items",
        "100 items",
        "5 items",
        "50 items",
        "3 items",
        "30 items",
        "7 items",
      ],
    },
  ],
  perPage: 5,
  // Demonstrates smart numeric sorting: click column headers to sort
  // - Numbers sort numerically (1, 2, 3, 5, 7, 10...) not alphabetically (1, 10, 100, 2, 20...)
  // - Currency values ($1.50, $2.00, $10.99) sort by numeric value, not string
  // - Handles units (1GB, 10GB, 100GB) and counts (1 item, 10 items) correctly
};

// DataView demonstrating ISO date sorting
export const dataViewDateSort = {
  component: "data-view" as const,
  id: "dataview-date-sort",
  fields: [
    {
      id: "event",
      name: "Event",
      data_path: "events.name",
      data: [
        "Project Kickoff",
        "Design Review",
        "Development Sprint",
        "QA Testing",
        "Production Deploy",
        "Retrospective",
      ],
    },
    {
      id: "date",
      name: "Date",
      data_path: "events.date",
      data: [
        "2025-01-15",
        "2025-02-10",
        "2024-12-20",
        "2025-03-05",
        "2025-04-01",
        "2025-04-15",
      ],
    },
    {
      id: "time",
      name: "Time",
      data_path: "events.time",
      data: [
        "2025-01-15T09:00:00Z",
        "2025-02-10T14:30:00Z",
        "2024-12-20T10:15:00Z",
        "2025-03-05T16:45:00Z",
        "2025-04-01T08:00:00Z",
        "2025-04-15T13:20:00Z",
      ],
    },
    {
      id: "status",
      name: "Status",
      data_path: "events.status",
      data: [
        "Complete",
        "Complete",
        "Complete",
        "In Progress",
        "Pending",
        "Pending",
      ],
    },
  ],
  perPage: 10,
  // Demonstrates ISO date/time sorting: dates sort chronologically regardless of display order
  // 2024-12-20 < 2025-01-15 < 2025-02-10 < 2025-03-05 < 2025-04-01 < 2025-04-15
};

// DataView demonstrating item click functionality
export const dataViewItemClick = {
  component: "data-view" as const,
  id: "dataview-item-click",
  fields: [
    {
      id: "product-name",
      name: "Product",
      data_path: "products.name",
      data: [
        "Laptop Pro 15",
        "Wireless Mouse",
        "Mechanical Keyboard",
        "USB-C Hub",
        'Monitor 27"',
      ],
    },
    {
      id: "product-price",
      name: "Price",
      data_path: "products.price",
      data: ["$1,299", "$29.99", "$149.99", "$79.99", "$399.99"],
    },
    {
      id: "product-stock",
      name: "Stock",
      data_path: "products.stock",
      data: ["15 units", "50 units", "32 units", "8 units", "12 units"],
    },
    {
      id: "product-category",
      name: "Category",
      data_path: "products.category",
      data: [
        "Computers",
        "Accessories",
        "Accessories",
        "Accessories",
        "Displays",
      ],
    },
  ],
  perPage: 5,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
};

// DataView demonstrating formatter functions with icons.
export const dataViewWithIcons = {
  component: "data-view" as const,
  id: "dataview-with-icons",
  fields: [
    {
      id: "server-name",
      name: "Server",
      data_path: "servers.name",
      data: [
        "prod-web-01",
        "prod-db-01",
        "staging-web-01",
        "dev-api-01",
        "prod-cache-01",
      ],
    },
    {
      id: "server-status",
      name: "Status",
      data_path: "servers.status",
      data: ["Running", "Running", "Stopped", "Running", "Warning"],
    },
    {
      id: "server-health",
      name: "Health",
      data_path: "servers.health",
      data: ["healthy", "healthy", "degraded", "healthy", "warning"],
    },
    {
      id: "server-cpu",
      name: "CPU Usage",
      data_path: "servers.cpu",
      data: ["45%", "78%", "0%", "23%", "89%"],
    },
    {
      id: "server-memory",
      name: "Memory",
      data_path: "servers.memory",
      data: [
        "8GB / 16GB",
        "12GB / 16GB",
        "0GB / 8GB",
        "2GB / 8GB",
        "14GB / 16GB",
      ],
    },
  ],
  perPage: 5,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
};

// DynamicComponents example using DataView with formatted columns
export const dynamicDemoDataViewWithFormatters = {
  component: "data-view" as const,
  key: "dataview-formatters-demo",
  props: dataViewWithIcons,
};

// DataView demonstrating subscriptions with dates, booleans, and URLs
export const dataViewSubscriptions = {
  component: "data-view" as const,
  id: "inline_table.dataset_1",
  title: "Subscriptions",
  fields: [
    {
      id: "subscriptions-id",
      name: "ID",
      data_path: "$..subscriptions[*].id",
      data: [
        "EUS-101",
        "EUS-112",
        "EUS-254",
        "EUS-111",
        "EUS-132",
        "EUS-354",
        "EUS-401",
        "EUS-412",
        "EUS-554",
        "EUS-501",
        "EUS-512",
        "EUS-654",
        "EUS-601",
        "EUS-612",
        "EUS-654",
      ],
    },
    {
      id: "subscriptions-name",
      name: "Name",
      data_path: "$..subscriptions[*].name",
      data: [
        "RHEL",
        "Red Hat Developer",
        "EAP",
        "ACVR",
        "Red Hat SSS subscription",
        "OLP",
        "JSR subscription",
        "MMM",
        "KOLER subscription",
        "FEL subscription",
        "OLPIC subscription",
        "SAE subscription",
        "MEKOL subscription",
        "Red Hat ORUL subscription",
        "YOLO subscription",
      ],
    },
    {
      id: "subscriptions-viewUrl",
      name: "View URL",
      data_path: "$..subscriptions[*].viewUrl",
      data: [
        "https://access.redhat.com/sub/EUS-101",
        "https://access.redhat.com/sub/EUS-112",
        "https://access.redhat.com/sub/EUS-254",
        "https://access.redhat.com/sub/asdasdad",
        "https://access.redhat.com/sub/45gdfge",
        "https://access.redhat.com/sub/w4tgtedgsd",
        "https://access.redhat.com/sub/45tgedsweerf",
        "https://access.redhat.com/sub/435tefvsd",
        "https://access.redhat.com/sub/4w5tgeagncj",
        "https://access.redhat.com/sub/kj34w5ywh",
        "https://access.redhat.com/sub/2tgergsd",
        "https://access.redhat.com/sub/45tgesdf",
        "https://access.redhat.com/sub/45gsdf",
        "https://access.redhat.com/sub/543tgeasdvs",
        "https://access.redhat.com/sub/08it7jrdntrfg",
      ],
    },
    {
      id: "subscriptions-endDate",
      name: "End Date",
      data_path: "$..subscriptions[*].endDate",
      data: [
        "2024-12-24",
        "2025-04-13",
        "2025-07-26",
        "2024-12-24",
        "2025-04-13",
        "2025-07-26",
        "2024-12-24",
        "2025-04-13",
        "2025-07-26",
        "2024-12-24",
        "2025-04-13",
        "2025-07-26",
        "2024-12-24",
        "2025-04-13",
        "2025-07-26",
      ],
    },
    {
      id: "subscriptions-supported",
      name: "Supported",
      data_path: "$..subscriptions[*].supported",
      data: [
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
      ],
    },
    {
      id: "subscriptions-numOfRuntimes",
      name: "Number of Runtimes",
      data_path: "$..subscriptions[*].numOfRuntimes",
      data: [2, 4, 3, 5, 1, 2, 2, 3, 2, 4, 2, 3, 2, 2, 325],
    },
    {
      id: "subscriptions-editLink",
      name: "Edit Link",
      data_path: "$..subscriptions[*].editLink",
      data: [
        "https://access.redhat.com/sub/e/3ygrstg",
        "https://access.redhat.com/sub/e/3ygrstg2",
        "https://access.redhat.com/sub/e/3ygrst3",
        "https://access.redhat.com/sub/e/asdasdad",
        "https://access.redhat.com/sub/e/45gdfge",
        "https://access.redhat.com/sub/e/w4tgtedgsd",
        "https://access.redhat.com/sub/e/45tgedsweerf",
        "https://access.redhat.com/sub/e/435tefvsd",
        "https://access.redhat.com/sub/e/4w5tgeagncj",
        "https://access.redhat.com/sub/e/kj34w5ywh",
        "https://access.redhat.com/sub/e/2tgergsd",
        "https://access.redhat.com/sub/e/45tgesdf",
        "https://access.redhat.com/sub/e/45gsdf",
        "https://access.redhat.com/sub/e/543tgeasdvs",
        "https://access.redhat.com/sub/e/08it7jrdntrfg",
      ],
    },
    {
      id: "subscriptions-renewalLink",
      name: "Renewal Link",
      data_path: "$..subscriptions[*].renewalLink",
      data: [
        "https://access.redhat.com/sub/r/3ygrstg",
        "https://access.redhat.com/sub/r/3ygrstg2",
        "https://access.redhat.com/sub/r/3ygrst3",
        "https://access.redhat.com/sub/r/asdasdad",
        "https://access.redhat.com/sub/r/45gdfge",
        "https://access.redhat.com/sub/r/w4tgtedgsd",
        "https://access.redhat.com/sub/r/45tgedsweerf",
        "https://access.redhat.com/sub/r/435tefvsd",
        "https://access.redhat.com/sub/r/4w5tgeagncj",
        "https://access.redhat.com/sub/r/kj34w5ywh",
        "https://access.redhat.com/sub/r/2tgergsd",
        "https://access.redhat.com/sub/r/45tgesdf",
        "https://access.redhat.com/sub/r/45gsdf",
        "https://access.redhat.com/sub/r/543tgeasdvs",
        "https://access.redhat.com/sub/r/08it7jrdntrfg",
      ],
    },
  ],
  perPage: 10,
  enableFilters: true,
  enablePagination: true,
  enableSort: true,
};

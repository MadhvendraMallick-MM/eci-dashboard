# 🇮🇳 ECI Live Results Dashboard

### Election Data Visualization, Live Vote Tracking & Decision Support

An interactive election monitoring project designed to bring election results, constituency-level analytics, and live vote tallying into a unified dashboard experience.

The project combines data retrieval, visualization, and real-time communication to explore how complex election information can be presented in a structured and accessible way.

<p align="center">
  <a href="https://github.com/MadhvendraMallick-MM/eci-dashboard">
    <img src="https://img.shields.io/badge/Project-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
  </a>
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Analytics-Data%20Visualization-2563EB?style=for-the-badge" alt="Data Analytics"/>
</p>

---

## 📌 Overview

Election-related information can involve multiple constituencies, candidates, voting rounds, and changing vote counts. Presenting these details clearly is important for understanding results and tracking developments.

The **ECI Live Results Dashboard** explores a centralized interface for viewing election data, examining analytics, and tracking manually entered vote counts alongside official data.

The project includes a browser-based dashboard and a mobile-friendly tally interface, with real-time synchronization between the two.

### 🎯 Project Objectives

- Organize election information in a structured dashboard.
- Present constituency and candidate-level data for easier analysis.
- Explore analytical views such as trends and win-probability estimates.
- Enable mobile-based manual tally entry with real-time dashboard synchronization.
- Keep official election data distinct from manually entered tally data.
- Demonstrate how data systems can support monitoring and information-based decisions.

---

## ✨ Key Features

### 📊 1. Election Results Dashboard

A centralized view for presenting election results using official ECI data retrieved through the application.

The dashboard is designed to make election-related information easier to review and interpret.

### 📈 2. Analytics & Trends

A dedicated analytics view explores additional perspectives on election data, including trends, map-based information, and win-probability analysis.

These analytical outputs should be interpreted according to their underlying data and methodology, rather than treated as guaranteed predictions.

### 📱 3. OG Tally Mobile Interface

A mobile-friendly interface allows users to enter manual vote tallies by constituency, candidate, and round.

The interface supports incremental vote entry through predefined controls, making it suitable for structured tally recording.

### ⚡ 4. Real-Time Synchronization

WebSocket communication connects the mobile tally interface with the dashboard.

When a tally is entered through the mobile interface, the update can be synchronized with the dashboard without relying on a manual page refresh for every entry.

### 🔎 5. Separate Data Sources

The project distinguishes official ECI data from manually entered OG tally data through separate presentation.

This separation supports clearer interpretation and reduces the risk of confusing official figures with independently entered figures.

### 🌗 6. Light & Dark Modes

The interface includes light and dark display modes to support different viewing preferences.

---

## 🧠 How the System Works

The application brings together data retrieval, dashboard presentation, and mobile tally entry.

```text
          OFFICIAL ECI DATA
                  |
                  v
        Data Retrieval & Parsing
                  |
                  v
          ELECTION DASHBOARD
          /               \
         v                 v
  Results & Metrics    Analytics & Trends
                           

        MOBILE TALLY INTERFACE
                  |
                  v
          Manual Vote Entry
                  |
                  v
          WebSocket Updates
                  |
                  v
          DASHBOARD DISPLAY
```

The official-data workflow and the manual-tally workflow serve different purposes. Their figures should remain identifiable as separate sources throughout the application.

---

## 🛠️ Technology Stack

| Technology | Application |
|:--|:--|
| Node.js | JavaScript runtime for the server |
| Express.js | Web server and application endpoints |
| Axios | HTTP requests for retrieving data |
| Cheerio | HTML parsing and data extraction |
| WebSocket (`ws`) | Real-time communication between the tally interface and dashboard |
| HTML, CSS & JavaScript | Browser-based interface, as applicable to the implementation |

---

## 💼 MBA & Business Perspective

This project demonstrates how technical systems can be understood through a business lens. Beyond displaying information, a well-designed dashboard can help people interpret data, monitor changes, and make more informed decisions.

As a PGDM Marketing student, I find this particularly relevant to the intersection of **data analytics, customer experience, product management, and business decision-making**.

### 1. Data-Driven Decision-Making

Businesses frequently work with large volumes of information, but raw data alone is rarely sufficient.

Dashboards help organize relevant metrics into a format that can be reviewed and interpreted more efficiently.

**MBA connection:** Business analytics, management information systems, and evidence-based decision-making.

### 2. Information Design & User Experience

The value of a dashboard depends partly on how effectively it communicates information.

Organizing results, analytics, and manual tally data into distinct views illustrates the importance of information hierarchy, clarity, and consistent presentation.

**Marketing connection:** Customer experience, communication design, and information accessibility.

### 3. Product Management

Building a useful digital product requires identifying user needs and translating them into practical features.

This project provides a practical context for thinking about:

- **Problem identification:** Understanding the challenges of monitoring complex election information.
- **Feature prioritization:** Separating essential results views from additional analytics.
- **User workflows:** Supporting both desktop monitoring and mobile tally entry.
- **System coordination:** Connecting separate interfaces through real-time communication.
- **Data transparency:** Making the distinction between official and manually entered information clear.

**Product management connection:** User-centric design, feature planning, and product functionality.

### 4. Stakeholder-Oriented Thinking

Different users may need different views of the same underlying information.

A dashboard can support more structured information access by presenting relevant data in a form appropriate to the task being performed.

**Business connection:** Stakeholder needs, operational monitoring, and management reporting.

### 5. Analytical Interpretation

Metrics and visualizations can help people explore patterns, compare observations, and formulate questions.

However, the usefulness of an analytical output depends on data quality, assumptions, and the method used to generate it.

**MBA connection:** Critical thinking, quantitative analysis, and responsible interpretation of data.

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your computer
- npm, included with Node.js
- Git
- A laptop and, optionally, an Android phone on the same Wi-Fi network for testing the mobile tally interface

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/MadhvendraMallick-MM/eci-dashboard.git
```

**2. Open the project directory**

```bash
cd eci-dashboard
```

**3. Install the dependencies**

```bash
npm install
```

**4. Start the application**

```bash
npm start
```

**5. Open the dashboard**

Visit the following address in your browser:

`http://localhost:3000`

### Access the Mobile Tally Interface

1. Ensure your laptop and Android phone are connected to the same Wi-Fi network.
2. Find the local IP address displayed in the server terminal.
3. Open `http://YOUR_LOCAL_IP:3000/tally` on your phone, replacing `YOUR_LOCAL_IP` with the displayed address.
4. Use the tally interface to enter manual vote counts and observe synchronization with the dashboard.

Local network access depends on your firewall, network configuration, and server settings.

---

## 🔭 Future Scope

Potential areas for further development include:

- Improving data validation and error handling.
- Adding clearer explanations of analytical metrics and win-probability methodology.
- Introducing data freshness indicators and source timestamps.
- Improving mobile responsiveness and accessibility.
- Adding exportable reports for further analysis.
- Developing more structured comparisons across constituencies and voting rounds.
- Evaluating dashboard usability through structured user testing.

These are possible enhancements rather than claims about existing functionality.

---

## 🎓 Skills Demonstrated

**Technical and analytical**
- Node.js application setup
- HTTP data retrieval and HTML parsing
- Real-time communication using WebSockets
- Dashboard-oriented information presentation
- Working with structured data and analytical outputs

**Business and management**
- Data-driven decision support
- Information prioritization
- User-oriented product thinking
- Stakeholder-focused information design
- Critical interpretation of metrics

---

## 👤 About This Project

The ECI Live Results Dashboard is a practical exploration of how data retrieval, visualization, and real-time communication can be combined into an interactive information system.

As a PGDM Marketing student, I am interested in understanding how technology and analytics can support better decisions, improve information accessibility, and create useful digital experiences.

This project reflects that interest by connecting technical implementation with broader ideas in product management, business analytics, and user-centric design.

---

<p align="center">
  <b>Turning complex information into clearer, more actionable insights.</b>
</p>

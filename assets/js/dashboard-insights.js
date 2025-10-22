/**
 * Dashboard Strategy Studio & Insights
 * Adds scenario simulation, stat syncing, and executive insight updates.
 */

(function () {
    const statMeta = {
        revenue: { format: 'currency', currency: 'USD', positiveDirection: 'up' },
        users: { format: 'number', positiveDirection: 'up' },
        projects: { format: 'number', positiveDirection: 'up' },
        tasks: { format: 'number', positiveDirection: 'down' }
    };

    const scenarioData = {
        balanced: {
            badge: 'Balanced Momentum',
            stats: {
                revenue: { value: 48210, delta: 11.3, suffix: 'vs last month' },
                users: { value: 13204, delta: 9.1, suffix: 'vs last month' },
                projects: { value: 246, delta: 6.0, suffix: 'vs last month' },
                tasks: { value: 84, delta: -4.8, suffix: 'vs last month' }
            },
            metrics: {
                runway: { value: '16 mo', progress: 0.68 },
                activation: { value: '+18%', progress: 0.62 },
                efficiency: { value: '31%', progress: 0.54 }
            },
            chart: {
                label: 'Balanced Health',
                labels: ['Revenue Momentum', 'Activation Velocity', 'Delivery Confidence', 'Team Leverage', 'Customer NPS'],
                data: [82, 74, 69, 72, 77],
                background: 'rgba(102, 126, 234, 0.25)',
                border: 'rgba(102, 126, 234, 0.85)'
            },
            insights: {
                variants: [
                    {
                        lead: 'Revenue holds steady while activation climbs.',
                        tags: ['Focus: Adoption', 'Risk: Ops Debt'],
                        bullets: [
                            'Stand up a cross-functional growth pod to shorten activation from 14 to 9 days.',
                            'Pair customer success with product analytics to maintain 96% renewal quality.',
                            'Bundle onboarding micro-courses into enterprise trials to convert high-intent cohorts.'
                        ],
                        confidence: 0.68
                    },
                    {
                        lead: 'Product adoption outpaces hiring, but delivery buffers remain safe.',
                        tags: ['Focus: Enablement', 'Watch: Hiring Pace'],
                        bullets: [
                            'Deploy enablement kits for new pods to keep delivery cycles below 10 days.',
                            'Layer progressive profiling on signup to surface high-fit pipeline earlier.',
                            'Audit automation backlog to clear 14% of repetitive support requests.'
                        ],
                        confidence: 0.64
                    }
                ]
            }
        },
        growth: {
            badge: 'Aggressive Growth',
            stats: {
                revenue: { value: 58940, delta: 21.7, suffix: 'vs last month' },
                users: { value: 17835, delta: 26.4, suffix: 'vs last month' },
                projects: { value: 312, delta: 18.9, suffix: 'vs last month' },
                tasks: { value: 143, delta: 19.4, suffix: 'vs last month' }
            },
            metrics: {
                runway: { value: '12 mo', progress: 0.52 },
                activation: { value: '+34%', progress: 0.84 },
                efficiency: { value: '24%', progress: 0.42 }
            },
            chart: {
                label: 'Expansion Pulse',
                labels: ['Revenue Momentum', 'Activation Velocity', 'Delivery Confidence', 'Team Leverage', 'Customer NPS'],
                data: [94, 88, 61, 68, 73],
                background: 'rgba(34, 211, 238, 0.25)',
                border: 'rgba(34, 211, 238, 0.85)'
            },
            insights: {
                variants: [
                    {
                        lead: 'Demand spikes require orchestrated onboarding support.',
                        tags: ['Focus: Speed to Value', 'Risk: Burnout'],
                        bullets: [
                            'Spin up a concierge onboarding lane for enterprise deals closing this sprint.',
                            'Rebalance roadmap to unlock billing automation before Q3 volume hits.',
                            'Invest in async education flows to absorb 26% more users without extra headcount.'
                        ],
                        confidence: 0.58
                    },
                    {
                        lead: 'Acquisition streak strains delivery guardrails.',
                        tags: ['Focus: Support Load', 'Watch: Churn Signals'],
                        bullets: [
                            'Roll out proactive health scoring to flag customers needing launch specialists.',
                            'Backfill L2 coverage by pairing senior ICs with automation playbooks.',
                            'Negotiate strategic vendor credits to offset the 8% spend uptick.'
                        ],
                        confidence: 0.55
                    }
                ]
            }
        },
        efficiency: {
            badge: 'Operational Excellence',
            stats: {
                revenue: { value: 43280, delta: 7.6, suffix: 'vs last month' },
                users: { value: 10840, delta: 3.1, suffix: 'vs last month' },
                projects: { value: 198, delta: 2.4, suffix: 'vs last month' },
                tasks: { value: 64, delta: -18.2, suffix: 'vs last month' }
            },
            metrics: {
                runway: { value: '22 mo', progress: 0.82 },
                activation: { value: '+11%', progress: 0.48 },
                efficiency: { value: '38%', progress: 0.76 }
            },
            chart: {
                label: 'Efficiency Radar',
                labels: ['Revenue Momentum', 'Activation Velocity', 'Delivery Confidence', 'Team Leverage', 'Customer NPS'],
                data: [74, 62, 83, 88, 79],
                background: 'rgba(67, 233, 123, 0.25)',
                border: 'rgba(67, 233, 123, 0.85)'
            },
            insights: {
                variants: [
                    {
                        lead: 'Margin climbs while customer velocity stays healthy.',
                        tags: ['Focus: Automation', 'Upside: Expansion'],
                        bullets: [
                            'Automate deployment review to save 140 engineer hours per month.',
                            'Redeploy senior ICs to value engineering squads for top 20 accounts.',
                            'Offer premium uptime SLAs as a monetized add-on leveraging 38% margin.'
                        ],
                        confidence: 0.74
                    },
                    {
                        lead: 'Delivery teams gain slack to tackle innovation backlog.',
                        tags: ['Focus: Innovation', 'Risk: Engagement'],
                        bullets: [
                            'Greenlight a rapid prototype crew to ship two retention levers this quarter.',
                            'Rotate people leaders through customer shadowing to preserve empathy scores.',
                            'Channel surplus margin into customer advocacy programs before Q4 launch.'
                        ],
                        confidence: 0.71
                    }
                ]
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        if ((document.body.dataset.page || '').toLowerCase() !== 'dashboard') {
            return;
        }

        const scenarioButtons = Array.from(document.querySelectorAll('[data-scenario]'));
        if (!scenarioButtons.length) {
            return;
        }

        const elements = collectElements();
        const refreshButton = document.querySelector('[data-insights-refresh]');
        const chartCanvas = document.getElementById('strategyMomentumChart');

        let chartInstance = null;
        const state = {
            current: 'balanced',
            variants: Object.keys(scenarioData).reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {})
        };

        function collectElements() {
            const statKeys = Object.keys(statMeta);
            const stats = statKeys.reduce((acc, key) => {
                acc[key] = {
                    value: document.querySelector(`[data-stat-value="${key}"]`),
                    change: document.querySelector(`[data-stat-change="${key}"]`),
                    trend: document.querySelector(`[data-stat-trend="${key}"]`),
                    label: document.querySelector(`[data-stat-label="${key}"]`)
                };
                return acc;
            }, {});

            const metricCollection = {};
            document.querySelectorAll('[data-metric-value]').forEach((el) => {
                const key = el.dataset.metricValue;
                if (!key) {
                    return;
                }
                metricCollection[key] = metricCollection[key] || {};
                metricCollection[key].value = el;
            });
            document.querySelectorAll('[data-metric-progress]').forEach((el) => {
                const key = el.dataset.metricProgress;
                if (!key) {
                    return;
                }
                metricCollection[key] = metricCollection[key] || {};
                metricCollection[key].bar = el;
            });

            const insightTexts = Array.from(document.querySelectorAll('[data-insight-text]')).sort(
                (a, b) => Number(a.dataset.insightText) - Number(b.dataset.insightText)
            );

            return {
                badge: document.querySelector('[data-scenario-badge]'),
                stats,
                metrics: metricCollection,
                insightLead: document.querySelector('[data-insight-lead]'),
                insightTags: document.querySelector('[data-insight-tags]'),
                insightTexts,
                confidenceValue: document.querySelector('[data-confidence-value]'),
                confidenceBar: document.querySelector('[data-confidence-bar]')
            };
        }

        function setActiveButton(key) {
            scenarioButtons.forEach((btn) => {
                const isActive = btn.dataset.scenario === key;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });
        }

        function formatStatValue(value, meta) {
            if (meta.format === 'currency') {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: meta.currency || 'USD',
                    maximumFractionDigits: 0
                }).format(value);
            }
            return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
        }

        function applyScenario(key) {
            const scenario = scenarioData[key];
            if (!scenario) {
                return;
            }

            state.current = key;
            setActiveButton(key);

            if (elements.badge) {
                elements.badge.textContent = scenario.badge;
            }

            updateStats(scenario.stats);
            updateMetrics(scenario.metrics);
            updateInsights(key, scenario.insights);
            updateChart(scenario);
        }

        function updateStats(stats) {
            Object.entries(stats).forEach(([key, stat]) => {
                const meta = statMeta[key];
                const parts = elements.stats[key];
                if (!meta || !parts) {
                    return;
                }

                if (parts.value) {
                    parts.value.textContent = formatStatValue(stat.value, meta);
                }

                const delta = Number(stat.delta) || 0;
                const absoluteDelta = Math.abs(delta).toFixed(1);
                const suffix = stat.suffix || 'vs last month';

                if (parts.label) {
                    const sign = delta >= 0 ? '+' : '-';
                    parts.label.textContent = `${sign}${absoluteDelta}% ${suffix}`;
                }

                if (parts.trend) {
                    parts.trend.classList.remove('bi-arrow-up', 'bi-arrow-down');
                    parts.trend.classList.add(delta >= 0 ? 'bi-arrow-up' : 'bi-arrow-down');
                }

                if (parts.change) {
                    const positiveDirection = meta.positiveDirection === 'down' ? delta < 0 : delta >= 0;
                    parts.change.classList.toggle('positive', positiveDirection);
                    parts.change.classList.toggle('negative', !positiveDirection);
                }
            });
        }

        function updateMetrics(metrics) {
            Object.entries(metrics).forEach(([key, metric]) => {
                const metricParts = elements.metrics[key];
                if (!metricParts) {
                    return;
                }

                if (metricParts.value) {
                    metricParts.value.textContent = metric.value;
                }

                if (metricParts.bar) {
                    const progress = Math.max(0, Math.min(1, Number(metric.progress)));
                    metricParts.bar.style.width = `${(progress * 100).toFixed(0)}%`;
                }
            });
        }

        function updateInsights(key, insights) {
            if (!insights || !Array.isArray(insights.variants) || !insights.variants.length) {
                return;
            }

            const variants = insights.variants;
            const index = state.variants[key] % variants.length;
            const variant = variants[index];

            if (elements.insightLead) {
                elements.insightLead.textContent = variant.lead;
            }

            if (elements.insightTags) {
                elements.insightTags.innerHTML = '';
                variant.tags.forEach((tag) => {
                    const span = document.createElement('span');
                    span.className = 'insight-tag';
                    span.textContent = tag;
                    elements.insightTags.appendChild(span);
                });
            }

            elements.insightTexts.forEach((node, idx) => {
                if (!node) {
                    return;
                }
                node.textContent = variant.bullets[idx] || '';
            });

            const confidencePercent = Math.round((variant.confidence || 0) * 100);
            if (elements.confidenceValue) {
                elements.confidenceValue.textContent = `${confidencePercent}%`;
            }
            if (elements.confidenceBar) {
                elements.confidenceBar.style.width = `${confidencePercent}%`;
            }
        }

        function updateChart(scenario) {
            const chartConfig = scenario.chart;
            if (!chartCanvas || typeof Chart === 'undefined' || !chartConfig) {
                return;
            }

            if (!chartInstance) {
                chartInstance = new Chart(chartCanvas, {
                    type: 'radar',
                    data: {
                        labels: chartConfig.labels,
                        datasets: [
                            {
                                label: chartConfig.label,
                                data: chartConfig.data,
                                backgroundColor: chartConfig.background,
                                borderColor: chartConfig.border,
                                borderWidth: 2,
                                pointBackgroundColor: chartConfig.border,
                                pointBorderColor: '#ffffff'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            r: {
                                angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                suggestedMin: 30,
                                suggestedMax: 100,
                                ticks: {
                                    display: false
                                },
                                pointLabels: {
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label(context) {
                                        return `${context.label}: ${context.formattedValue}`;
                                    }
                                }
                            }
                        }
                    }
                });
                return;
            }

            chartInstance.data.labels = chartConfig.labels;
            const dataset = chartInstance.data.datasets[0];
            dataset.label = chartConfig.label;
            dataset.data = chartConfig.data;
            dataset.backgroundColor = chartConfig.background;
            dataset.borderColor = chartConfig.border;
            dataset.pointBackgroundColor = chartConfig.border;
            chartInstance.update();
        }

        scenarioButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.dataset.scenario;
                if (!key || key === state.current) {
                    return;
                }
                state.variants[key] = 0;
                applyScenario(key);
            });
        });

        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                const currentKey = state.current;
                const scenario = scenarioData[currentKey];
                if (!scenario || !scenario.insights || !scenario.insights.variants.length) {
                    return;
                }
                state.variants[currentKey] = (state.variants[currentKey] + 1) % scenario.insights.variants.length;
                updateInsights(currentKey, scenario.insights);
            });
        }

        applyScenario(state.current);
    });
})();

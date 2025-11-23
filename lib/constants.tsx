import React from 'react';

export const APP_NAME = "patent2product";

export const MOCK_PATENTS = [
    {
        id: "p1",
        title: "Autonomous Aerial Delivery Coordination System",
        patentNumber: "US-2024-98712",
        summary: "A system for coordinating multiple autonomous aerial vehicles to optimize delivery routes in urban environments using swarm intelligence.",
        productIdea: "SkyHive Logistics Platform",
        viabilityScore: 92,
        tags: ["Drone", "AI", "Logistics"]
    },
    {
        id: "p2",
        title: "Bio-metric Wearable Health Monitor with Predictive Analysis",
        patentNumber: "US-2023-55123",
        summary: "A wearable device sensor array that monitors blood glucose, cortisol, and hydration levels non-invasively.",
        productIdea: "OmniHealth Band",
        viabilityScore: 88,
        tags: ["HealthTech", "Wearable", "Bio"]
    },
    {
        id: "p3",
        title: "Solid State Energy Storage with Graphene Lattice",
        patentNumber: "US-2025-00129",
        summary: "A battery technology utilizing graphene lattice structures to increase energy density and reduce charging time by 80%.",
        productIdea: "InstaCharge Power Cells",
        viabilityScore: 95,
        tags: ["Energy", "Graphene", "Hardware"]
    }
];

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the JurisFlow MVP workspace", () => {
    render(<Home />);

    expect(screen.getByText("JurisFlow")).toBeInTheDocument();
    expect(screen.getByText("Kanban de atendimento")).toBeInTheDocument();
    expect(screen.getByText("Criar lead e caso")).toBeInTheDocument();
    expect(screen.getByText("Gerar resumo IA")).toBeInTheDocument();
  });
});

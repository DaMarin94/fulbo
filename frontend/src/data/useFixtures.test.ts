import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  useCompetitionById,
  useFixturesByCompetition,
  useFixturesByDate,
  useFixturesByTeam,
  useTeamById,
} from './useFixtures'
import { MOCK_ERROR_COMPETITION_ID, MOCK_ERROR_DATE, MOCK_ERROR_TEAM_ID } from './mockFixtures'
import { subscribeToasts } from '../lib/toast/toastBus'
import { toLocalDateKey } from '../lib/dateFormat'

const TODAY_KEY = toLocalDateKey(new Date())

describe('useFixturesByDate', () => {
  it('resuelve con los partidos del día y no dispara toast en éxito', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useFixturesByDate(TODAY_KEY))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.length).toBeGreaterThan(0)
    expect(listener).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('en error, pasa a status "error" y dispara un toast', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useFixturesByDate(MOCK_ERROR_DATE))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
})

describe('useFixturesByCompetition', () => {
  it('resuelve con los partidos de la competición', async () => {
    const { result } = renderHook(() => useFixturesByCompetition('primera-a'))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.every((f) => f.competition.id === 'primera-a')).toBe(true)
  })

  it('en error, dispara un toast', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useFixturesByCompetition(MOCK_ERROR_COMPETITION_ID))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
})

describe('useFixturesByTeam', () => {
  it('resuelve con los partidos del equipo', async () => {
    const { result } = renderHook(() => useFixturesByTeam('river-plate'))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.length).toBeGreaterThan(0)
  })

  it('en error, dispara un toast', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useFixturesByTeam(MOCK_ERROR_TEAM_ID))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
})

describe('useCompetitionById / useTeamById', () => {
  it('useCompetitionById resuelve la metadata sin disparar toast', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useCompetitionById('primera-a'))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.shortName).toBe('Primera A')
    expect(listener).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('useTeamById resuelve la metadata sin disparar toast', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)
    const { result } = renderHook(() => useTeamById('river-plate'))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data?.name).toBe('River Plate')
    expect(listener).not.toHaveBeenCalled()
    unsubscribe()
  })
})

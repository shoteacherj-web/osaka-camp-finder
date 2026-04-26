import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from '@/components/BottomSheet'

describe('BottomSheet', () => {
  it('isOpen=falseのとき子要素を表示しない', () => {
    render(
      <BottomSheet isOpen={false} onClose={jest.fn()}>
        <p>コンテンツ</p>
      </BottomSheet>
    )
    expect(screen.queryByText('コンテンツ')).toBeNull()
  })

  it('isOpen=trueのとき子要素を表示する', () => {
    render(
      <BottomSheet isOpen={true} onClose={jest.fn()}>
        <p>コンテンツ</p>
      </BottomSheet>
    )
    expect(screen.getByText('コンテンツ')).toBeInTheDocument()
  })

  it('オーバーレイをクリックすると onClose が呼ばれる', async () => {
    const onClose = jest.fn()
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <p>コンテンツ</p>
      </BottomSheet>
    )
    await userEvent.click(screen.getByTestId('bottom-sheet-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

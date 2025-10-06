import { Fancybox, FancyboxOptions } from '@fancyapps/ui'

Fancybox.getDefaults().placeFocusBack = false


// @ts-expect-error add global method
Fancybox.modal = {}
// @ts-expect-error add global method
Fancybox.modal.open = (src: string, options: Partial<FancyboxOptions>) => {
  return Fancybox.show(
    [
      {
        src: src,
        ...options,
      },
    ],
    {
      // @ts-expect-error incorrect fancybox types
      type: 'ajax',
      dragToClose: false,
      mainClass: 'fancybox-custom-modal',
      ...options,
    }
  )
}

window.Fancybox = Fancybox

function init() {
  // @ts-expect-error incorrect fancybox types
  Fancybox.bind('[data-fancybox-modal]', {
    type: 'ajax',
    dragToClose: false,
    mainClass: 'fancybox-custom-modal',
  })
}

interface CustomWindow extends Window {
  Fancybox: typeof Fancybox
}

declare let window: CustomWindow

export default { init }

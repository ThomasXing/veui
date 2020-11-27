import Checkbox from '../Checkbox'
import Sorter from './_Sorter'
import Popover from '../Popover'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import '../../common/uiTypes'
import { isFocusable } from '../../utils/dom'

export default {
  name: 'veui-table-head',
  components: {
    'veui-popover': Popover
  },
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  data () {
    return {
      openMap: {}
    }
  },
  methods: {
    handleMouseover (id, e) {
      if (isFocusable(e.target)) {
        this.$set(this.openMap, id, false)
      }
    },
    handleTogglePopover (status, id) {
      this.$set(this.openMap, id, status)
    }
  },
  render () {
    let { table } = this
    let depth = table.headerRows.length
    return (
      <thead>
        {table.headerRows.map((row, i) => (
          <tr>
            {table.selectable && i === 0 ? (
              <th
                scope="col"
                role="columnheader"
                rowspan={depth}
                class={{
                  [this.$c('table-cell-select')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft
                }}
                style={
                  table.scrollableX
                    ? {
                      left: 0
                    }
                    : null
                }
              >
                {i === 0 ? (
                  <div class={this.$c('table-cell')}>
                    <div class={this.$c('table-cell-content')}>
                      {table.selectMode === 'multiple' ? (
                        <Checkbox
                          checked={table.selectStatus !== 'none'}
                          disabled={!table.enabledData.length}
                          indeterminate={table.selectStatus === 'partial'}
                          onChange={checked => {
                            table.select(checked)
                          }}
                          aria-label={this.t(
                            table.selectStatus !== 'none'
                              ? '@table.unselectAll'
                              : '@table.selectAll'
                          )}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </th>
            ) : null}
            {table.expandable ? (
              <th
                scope="col"
                role="columnheader"
                class={{
                  [this.$c('table-cell-expand')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft
                }}
                style={
                  table.needFixLeft
                    ? {
                      left: table.selectable
                        ? `${table.selectColumnWidth}px`
                        : 0
                    }
                    : null
                }
              />
            ) : null}
            {row.map(col => {
              let isLeaf = col.columns.length === 0
              let desc = col.renderDesc({
                close: () => {
                  this.openMap[col.id] = false
                }
              })
              return (
                <th
                  class={{
                    [this.$c('table-cell-center')]: !isLeaf,
                    [this.$c(`table-cell-${col.align}`)]: !!col.align && isLeaf,
                    [this.$c('table-cell-interactive')]:
                      !!col.sortable && isLeaf,
                    [this.$c(`table-cell-sticky-${col.fixed}`)]:
                      table.scrollableX && col.fixed,
                    [this.$c('table-cell-first')]: col.first,
                    [this.$c('table-cell-last')]: col.last
                  }}
                  style={
                    table.scrollableX
                      ? {
                        [col.fixed]: col.offset
                      }
                      : null
                  }
                  scope="col"
                  role="columnheader"
                  aria-sort={
                    table.orderBy === col.field && table.order
                      ? `${table.order}ending`
                      : null
                  }
                  colspan={col.colspan > 1 ? col.colspan : null}
                  rowspan={col.rowspan > 1 ? col.rowspan : null}
                  ref={col.id}
                  onMouseover={e => {
                    if (desc) {
                      this.handleMouseover(col.id, e)
                    }
                  }}
                >
                  <div class={this.$c('table-cell')}>
                    <div class={this.$c('table-cell-content')}>
                      {col.renderHead()}{' '}
                    </div>
                    {col.sortable && isLeaf ? (
                      <Sorter
                        class={{
                          [this.$c('table-header-icon')]: true,
                          [this.$c('table-header-icon-active')]:
                            table.orderBy === col.field && table.order !== false
                        }}
                        order={
                          table.orderBy === col.field ? table.order : false
                        }
                        allowedOrders={col.allowedOrders || table.allowedOrders}
                        onSort={order => {
                          this.$emit('sort', col.field, order)
                        }}
                      />
                    ) : null}
                  </div>
                  {desc ? (
                    <veui-popover
                      ui={this.ui}
                      target={col.id}
                      open={this.openMap[col.id]}
                      onToggle={status =>
                        this.handleTogglePopover(status, col.id)
                      }
                    >
                      {desc}
                    </veui-popover>
                  ) : null}
                </th>
              )
            })}
            {i === 0 && table.gutterWidth ? (
              <th
                class={{
                  [this.$c('table-gutter')]: true,
                  [this.$c('table-cell-sticky-right')]: table.hasFixedRight
                }}
                style={
                  table.hasFixedRight
                    ? {
                      right: 0
                    }
                    : null
                }
                aria-hidden="true"
                role="columnheader"
                rowspan={depth > 1 ? depth : null}
              />
            ) : null}
          </tr>
        ))}
      </thead>
    )
  }
}
